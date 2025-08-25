from flask import Flask, jsonify
from neo4j import GraphDatabase
from tiwala_model import train_model, get_tiwala_index

# --- Initialize Flask App & Connect to Neo4j ---
app = Flask(__name__)
URI = "bolt://localhost:7687"
AUTH = ("neo4j", "hatdog123") # Change if needed
driver = GraphDatabase.driver(URI, auth=AUTH)

# --- Train The Model When the API Starts ---
print("Training the ML model on startup... This may take a moment.")
model = train_model(driver)
print("✅ Model is trained and ready to serve predictions!")

# --- Define the API Endpoint ---
@app.route("/predict/<string:farmer_id>", methods=['GET'])
def predict(farmer_id):
    """
    This creates a URL like /predict/f01 that our web app can call.
    """
    try:
        print(f"Received request for farmer_id: {farmer_id}")
        score = get_tiwala_index(farmer_id, model, driver)
        
        return jsonify({
            'farmer_id': farmer_id,
            'tiwala_index': score
        })
    except Exception as e:
        # Return a helpful error message in JSON format
        return jsonify({'error': str(e)}), 500

# --- Run the Flask App ---
if __name__ == '__main__':
    # We'll run on port 5001 to avoid conflicts with the Next.js app (port 3000)
    app.run(debug=True, port=5001)