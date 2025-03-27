from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import os
import re
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

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
def login():
    data = request.get_json()
    user = users_collection.find_one({"username": data['username']})
    if user and check_password_hash(user['password'], data['password']):
        return jsonify({"message": f"Welcome back, {user['username']}!"})
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/api/courses', methods=['GET'])
def get_all_courses():
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500
    courses = df.to_dict(orient="records")
    return jsonify(courses)

@app.route('/api/courses/random', methods=['GET'])
def get_random_courses():
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500
    
    # Get random courses (you can change the number of courses as needed)
    random_courses = df.sample(n=4)  # Fetch 4 random courses, change n to get a different number
    courses = random_courses.to_dict(orient="records")
    return jsonify(courses)

@app.route('/api/courses/search', methods=['GET'])
def search_courses():
    # Get query params
    query = request.args.get("query", "").lower().strip()
    rating = request.args.get("rating")
    price = request.args.get("price")
    level = request.args.get("level")
    duration = request.args.get("duration")
    page = int(request.args.get("page", 1))
    per_page = 10

    # Load data
    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500

    # Convert Rating to numeric for filtering
    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce')

    # Extract numeric part from Duration and convert to integer
    df['Duration'] = df['Duration'].str.extract(r'(\d+)').astype(int)

    # **Partial match search** for title and description
    if query:
        df = df[
            df['Title'].str.lower().str.contains(query) |
            df['Description'].str.lower().str.contains(query)
        ]

    # Apply filters for rating, price, level, duration
    if rating and rating.lower() != "all":
        try:
            df = df[df['Rating'] >= float(rating)]
        except ValueError:
            return jsonify({"error": "Invalid rating value"}), 400

    if price and price.lower() != "all":
        df = df[df['Price'].str.lower() == price.lower()]
    if level and level.lower() != "all":
        df = df[df['Level'].str.lower() == level.lower()]
    if duration and duration.lower() != "all":
        try:
            duration_value = int(duration)
            df = df[df['Duration'] == duration_value]
        except ValueError:
            return jsonify({"error": "Invalid duration value"}), 400

    # Pagination
    total_results = len(df)
    start = (page - 1) * per_page
    end = start + per_page
    paginated_courses = df.iloc[start:end].to_dict(orient="records")

    return jsonify({
        "total_results": total_results,
        "page": page,
        "per_page": per_page,
        "courses": paginated_courses
    })

if __name__ == "__main__":
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True)