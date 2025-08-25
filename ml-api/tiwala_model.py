import pandas as pd
from neo4j import GraphDatabase
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# --- Connection Details ---
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "hatdog123") # Change if needed

# This function fetches all data needed to train the comprehensive 3-feature model
def fetch_training_data(driver):
    query = """
    MATCH (f:Farmer)
    // Get repayment stats
    OPTIONAL MATCH (f)-[:PAID_ON_TIME]->(ontime)
    OPTIONAL MATCH (f)-[:PAID_LATE]->(late)
    WITH f, count(ontime) AS ontime_payments, count(late) AS late_payments
    // Get community stats
    WITH f, ontime_payments, late_payments,
         COUNT { (f)-[:SUPPORTED]->() } AS times_helped,
         COUNT { ()-[:SUPPORTED]->(f) } AS times_received_help
    // Get referral stats
    OPTIONAL MATCH (f)-[:REFERRED]->(referral)
    OPTIONAL MATCH (referral)-[:PAID_ON_TIME]->(ref_ontime)
    OPTIONAL MATCH (referral)-[:PAID_LATE]->(ref_late)
    WITH f, ontime_payments, late_payments, times_helped, times_received_help,
         count(ref_ontime) AS referrals_ontime_payments,
         count(ref_late) AS referrals_late_payments
    RETURN f.id AS farmer_id, ontime_payments, late_payments, times_helped, times_received_help,
           referrals_ontime_payments, referrals_late_payments
    """
    with driver.session() as session:
        result = session.run(query)
        return pd.DataFrame([record.data() for record in result])

# This function engineers all three features for the model
def engineer_training_features(df):
    df['repayment_ratio'] = (df['ontime_payments'] / (df['ontime_payments'] + df['late_payments'])).fillna(0.5)
    df['community_ratio'] = (df['times_helped'] / (df['times_helped'] + df['times_received_help'])).fillna(0.5)
    df['referral_quality_ratio'] = (df['referrals_ontime_payments'] / (df['referrals_ontime_payments'] + df['referrals_late_payments'])).fillna(0.5)
    
    # Target variable is based on the most important factor: repayment
    df['is_good_borrower'] = (df['repayment_ratio'] > 0.8).astype(int)
    return df

# The model is trained using all three features
def train_model(driver):
    raw_df = fetch_training_data(driver)
    featured_df = engineer_training_features(raw_df)

    features = ['repayment_ratio', 'community_ratio', 'referral_quality_ratio']
    target = 'is_good_borrower'

    X = featured_df[features]
    y = featured_df[target]

    # Return an empty model if there's not enough data to split
    if len(X) < 2:
        print("Not enough data to train a model.")
        return LogisticRegression() # Return a default, untrained model

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Check if the test set is not empty before predicting
    if not X_test.empty:
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Model trained with accuracy: {accuracy * 100:.2f}%")

    return model

# This is the dynamic scoring function with tiered logic
def get_tiwala_index(farmer_id, model, driver):
    """
    Calculates the Tiwala Index with the full three-component, tiered logic.
    """
    query = """
    MATCH (f:Farmer {id: $farmer_id})
    // 1. Get repayment stats
    WITH f,
         COUNT { (f)-[:PAID_ON_TIME]->() } AS ontime_payments,
         COUNT { (f)-[:PAID_LATE]->() } AS late_payments
    // 2. Get community stats
    WITH f, ontime_payments, late_payments,
         COUNT { (f)-[:SUPPORTED]->() } AS times_helped,
         COUNT { ()-[:SUPPORTED]->(f) } AS times_received_help
    // 3. Get referral stats
    OPTIONAL MATCH (f)-[:REFERRED]->(referral)
    WITH f, ontime_payments, late_payments, times_helped, times_received_help, collect(DISTINCT referral) AS referrals
    UNWIND referrals AS ref
    WITH ontime_payments, late_payments, times_helped, times_received_help,
         COLLECT(ref) AS ref_list,
         COUNT { (ref)-[:PAID_ON_TIME]->() } AS ref_ontime,
         COUNT { (ref)-[:PAID_LATE]->() } AS ref_late
    RETURN
      ontime_payments,
      late_payments,
      times_helped,
      times_received_help,
      sum(ref_ontime) AS referrals_ontime_total,
      sum(ref_late) AS referrals_late_total
    """
    with driver.session() as session:
        result = session.run(query, farmer_id=farmer_id).single()

    if not result: return 0

    # --- TIERED SCORING LOGIC ---
    total_payments = result['ontime_payments'] + result['late_payments']
    repayment_score = (result['ontime_payments'] / total_payments) * 1000 if total_payments > 0 else 500

    if repayment_score < 700:
        return int(repayment_score)
    else:
        total_community_events = result['times_helped'] + result['times_received_help']
        community_score = (result['times_helped'] / total_community_events) * 1000 if total_community_events > 0 else 500
        
        total_referral_payments = result['referrals_ontime_total'] + result['referrals_late_total']
        referral_score = (result['referrals_ontime_total'] / total_referral_payments) * 1000 if total_referral_payments > 0 else 500
        
        final_score = (repayment_score * 0.5) + (referral_score * 0.3) + (community_score * 0.2)
        return int(final_score)

# --- Main block for testing ---
if __name__ == "__main__":
    driver = GraphDatabase.driver(URI, auth=AUTH)
    trained_model = train_model(driver)
    
    print("\n--- Testing Tiered Tiwala Index ---")
    # Maria has a near-perfect record, should be "unlocked"
    score_f01 = get_tiwala_index('f01', trained_model, driver)
    print(f"Score for Maria Santos (f01 - excellent): {score_f01}")

    # Carlos has a poor record, should be "locked" and have a score < 700
    score_f03 = get_tiwala_index('f03', trained_model, driver)
    print(f"Score for Carlos Mendoza (f03 - struggling): {score_f03}")

    driver.close()