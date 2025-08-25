import pandas as pd
from neo4j import GraphDatabase
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# --- Connection Details ---
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "hatdog123") # Change if needed

# --- SCORING CONSTANTS ---
STARTING_SCORE = 350
UNLOCK_THRESHOLD = 700

# This function fetches all data needed to train the comprehensive 3-feature model
def fetch_training_data(driver):
    # THIS IS THE NEW, MORE ROBUST QUERY
    query = """
    MATCH (f:Farmer)
    RETURN
      f.id AS farmer_id,
      // Use COUNT subqueries for each metric to avoid cardinality issues
      COUNT { (f)-[:PAID_ON_TIME]->() } AS ontime_payments,
      COUNT { (f)-[:PAID_LATE]->() } AS late_payments,
      COUNT { (f)-[:SUPPORTED]->() } AS times_helped,
      COUNT { ()-[:SUPPORTED]->(f) } AS times_received_help,
      // Use a subquery to get the sum of referral payments
      COUNT {
          MATCH (f)-[:REFERRED]->(referral)
          MATCH (referral)-[:PAID_ON_TIME]->()
      } AS referrals_ontime_payments,
      COUNT {
          MATCH (f)-[:REFERRED]->(referral)
          MATCH (referral)-[:PAID_LATE]->()
      } AS referrals_late_payments
    """
    with driver.session() as session:
        result = session.run(query)
        return pd.DataFrame([record.data() for record in result])
    
    
def engineer_training_features(df):
    df['repayment_ratio'] = (df['ontime_payments'] / (df['ontime_payments'] + df['late_payments'])).fillna(0.5)
    df['community_ratio'] = (df['times_helped'] / (df['times_helped'] + df['times_received_help'])).fillna(0.5)
    df['referral_quality_ratio'] = (df['referrals_ontime_payments'] / (df['referrals_ontime_payments'] + df['referrals_late_payments'])).fillna(0.5)
    df['is_good_borrower'] = (df['repayment_ratio'] > 0.8).astype(int)
    return df

def train_model(driver):
    raw_df = fetch_training_data(driver)
    featured_df = engineer_training_features(raw_df)

    features = ['repayment_ratio', 'community_ratio', 'referral_quality_ratio']
    target = 'is_good_borrower'

    X = featured_df[features]
    y = featured_df[target]

    if len(X) < 2:
        print("Not enough data to train a model.")
        return LogisticRegression() 

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LogisticRegression()
    model.fit(X_train, y_train)

    if not X_test.empty:
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model trained with accuracy: {accuracy * 100:.2f}%")

    return model


# --- THIS IS THE REVISED DYNAMIC SCORING FUNCTION ---
def get_tiwala_index(farmer_id, model, driver):
    """
    Calculates the Tiwala Index with the "New Borrower's Journey" tiered logic.
    """
    query = """
    MATCH (f:Farmer {id: $farmer_id})
    // 1. Get farmer's own payment stats
    WITH f,
         COUNT { (f)-[:PAID_ON_TIME]->() } AS ontime_payments,
         COUNT { (f)-[:PAID_LATE]->() } AS late_payments,
         COUNT { (f)-[:SUPPORTED]->() } AS times_helped,
         COUNT { ()-[:SUPPORTED]->(f) } AS times_received_help
    // 2. Get all direct referrals
    OPTIONAL MATCH (f)-[:REFERRED]->(referral)
    // 3. For each referral, get their payment stats
    WITH ontime_payments, late_payments, times_helped, times_received_help, referral
    RETURN
      ontime_payments,
      late_payments,
      times_helped,
      times_received_help,
      // Aggregate the payment counts from all referrals
      sum(DISTINCT COUNT {(referral)-[:PAID_ON_TIME]->()}) AS referrals_ontime_total,
      sum(DISTINCT COUNT {(referral)-[:PAID_LATE]->()}) AS referrals_late_total
    """
    with driver.session() as session:
        result = session.run(query, farmer_id=farmer_id).single()

    if not result: return 0

    ontime = result['ontime_payments']
    late = result['late_payments']
    total_payments = ontime + late

    # Handle brand new farmers
    if total_payments == 0:
        return STARTING_SCORE

    # Calculate repayment ratio
    repayment_ratio = ontime / total_payments
    
    # Check if the farmer is in the "Locked Tier"
    repayment_based_score = repayment_ratio * 1000
    if repayment_based_score < UNLOCK_THRESHOLD:
        # Use the linear mapping formula for the locked tier
        score_range = UNLOCK_THRESHOLD - STARTING_SCORE
        locked_score = STARTING_SCORE + (repayment_ratio * score_range)
        return int(locked_score)
    else:
        # If "Unlocked", calculate the full three-component score
        total_community_events = result['times_helped'] + result['times_received_help']
        community_score = (result['times_helped'] / total_community_events) * 1000 if total_community_events > 0 else 500
        
        referrals_ontime = result['referrals_ontime_total'] if result['referrals_ontime_total'] is not None else 0
        referrals_late = result['referrals_late_total'] if result['referrals_late_total'] is not None else 0
        
        total_referral_payments = referrals_ontime + referrals_late
        referral_score = (referrals_ontime / total_referral_payments) * 1000 if total_referral_payments > 0 else 500
        
        final_score = (repayment_based_score * 0.5) + (referral_score * 0.3) + (community_score * 0.2)
        return int(final_score)

# --- Main block for testing ---
if __name__ == "__main__":
    driver = GraphDatabase.driver(URI, auth=AUTH)
    trained_model = train_model(driver)
    
    print("\n--- Testing New Borrower's Journey (Starting Score: 350) ---")
    
    # Maria has an excellent record, should be "unlocked" and have a high score
    score_f01 = get_tiwala_index('f01', trained_model, driver)
    print(f"Score for Maria Santos (f01 - Unlocked): {score_f01}")

    # Carlos has a poor record, should be "locked" and have a score between 350-700
    score_f03 = get_tiwala_index('f03', trained_model, driver)
    print(f"Score for Carlos Mendoza (f03 - Locked): {score_f03}")
    
    # Rosa is brand new, should have the starting score
    score_f05 = get_tiwala_index('f05', trained_model, driver)
    print(f"Score for Rosa Cruz (f05 - New): {score_f05}")

    driver.close()