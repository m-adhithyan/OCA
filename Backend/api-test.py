from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from pymongo import MongoClient
import pandas as pd
import os
import re
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Enable CORS for all routes and allow frontend requests
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Connect to MongoDB
try:
    db_client = MongoClient("mongodb://localhost:27017/")
    db = db_client["user_database"]
    users_collection = db["users"]
    print("\u2705 Database connected successfully!")
except Exception as e:
    print(f"\u274C Failed to connect to database: {e}")

# Path to the courses CSV file
COURSE_CSV_PATH = "cleaned_merged_file.csv"

def load_course_data():
    """Load course data dynamically each time it's requested."""
    if not os.path.exists(COURSE_CSV_PATH):
        print("⚠️ Course data file missing!")
        return pd.DataFrame()
    return pd.read_csv(COURSE_CSV_PATH)

@app.route('/api/signup', methods=['POST'])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def signup():
    data = request.get_json()
    if users_collection.find_one({"$or": [{"username": data['username']}, {"email": data['email']}]}):
        return jsonify({"message": "User already exists"}), 400
    
    hashed_password = generate_password_hash(data['password'])
    new_user = {
        "username": data['username'],
        "email": data['email'],
        "password": hashed_password
    }
    users_collection.insert_one(new_user)
    return jsonify({"message": "Signup successful! Please login."}), 201

@app.route('/api/login', methods=['POST'])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def login():
    data = request.get_json()
    user = users_collection.find_one({"username": data['username']})
    if user and check_password_hash(user['password'], data['password']):
        return jsonify({"message": f"Welcome back, {user['username']}!"})
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/api/courses', methods=['GET'])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def get_all_courses():
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500
    courses = df.to_dict(orient="records")
    return jsonify(courses)

@app.route('/api/courses/random', methods=['GET'])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def get_random_courses():
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500
    
    random_courses = df.sample(n=4)  # Fetch 4 random courses
    courses = random_courses.to_dict(orient="records")
    return jsonify(courses)

@app.route('/api/courses/search', methods=['GET'])
@cross_origin(origin="http://localhost:5173", supports_credentials=True)
def search_courses():
    query = request.args.get("query", "").lower().strip()
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500
    
    normalized_query = re.sub(r"\W+", "", query)  # "full stack" → "fullstack"

    df['Normalized_Title'] = df['Title'].str.replace(r"\W+", "", regex=True).str.lower()
    df['Normalized_Description'] = df['Description'].str.replace(r"\W+", "", regex=True).str.lower()

    filtered_df = df[df['Normalized_Title'].str.contains(normalized_query, na=False) |
                     df['Normalized_Description'].str.contains(normalized_query, na=False)]

    courses = filtered_df.to_dict(orient="records")
    return jsonify(courses)

if __name__ == "__main__":
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True)
