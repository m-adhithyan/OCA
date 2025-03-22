from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np

app = Flask(__name__)
CORS(app)

# Connect to MongoDB
try:
    db_client = MongoClient("mongodb://localhost:27017/")
    db = db_client["user_database"]
    users_collection = db["users"]
    print("✅ Database connected successfully!")
except Exception as e:
    print(f"❌ Failed to connect to database: {e}")

# Load CSV dataset
COURSE_CSV_PATH = "cleaned_courses.csv"  # Ensure this file exists in the project directory
df = pd.read_csv(COURSE_CSV_PATH)

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if users_collection.find_one({"$or": [{"username": data['username']}, {"email": data['email']}]}):
        return jsonify({"message": "User already exists"}), 400
    new_user = {
        "username": data['username'],
        "email": data['email'],
        "password": data['password']
    }
    users_collection.insert_one(new_user)
    return jsonify({"message": "Signup successful! Please login."}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({"username": data['username'], "password": data['password']})
    if user:
        return jsonify({"message": f"Welcome back, {user['username']}!"})
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/api/courses', methods=['GET'])
def get_all_courses():
    """Fetch all courses with full details."""
    # Convert DataFrame to a list of dictionaries, replacing NaN with None
    courses = df.to_dict(orient="records")
    cleaned_courses = [{k: (v if not pd.isnull(v) else None) for k, v in course.items()} for course in courses]
    return jsonify(cleaned_courses)

@app.route('/api/courses/search', methods=['GET'])
def search_courses():
    """"Search for courses based on user input."""
    query = request.args.get("query", "").lower()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    # Print query for debugging
    print(f"🔍 Searching for: {query}")

    # Filter courses
    filtered_df = df[df['Title'].str.contains(query, na=False) |
                      df['Description'].str.contains(query, na=False)]
    
    # Convert filtered DataFrame to a list of dictionaries, replacing NaN with None
    cleaned_courses = [{k: (v if not pd.isnull(v) else None) for k, v in course.items()} for course in filtered_df.to_dict(orient="records")]

    # Print matching results
    print(f"✅ Found {len(cleaned_courses)} results")
    # Print the first 5 results
    print(cleaned_courses[:5])

    return jsonify(cleaned_courses)

if __name__ == "__main__":
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True)