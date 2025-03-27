from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import os
import re
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configure Flask-Mail for OTP email sending
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'simatprojectseven@gmail.com'      # Replace with your email
app.config['MAIL_PASSWORD'] = 'yvmt dlvq dcrn afzm'           # Replace with your app password
app.config['MAIL_DEFAULT_SENDER'] = 'your_email@gmail.com'
mail = Mail(app)

# Connect to MongoDB
db_client = MongoClient("mongodb://localhost:27017/")
db = db_client["user_database"]
users_collection = db["users"]
otp_collection = db["otp_verification"]

# Path to the courses CSV file
COURSE_CSV_PATH = "updated_cleaned_merged_file.csv"

def load_course_data():
    """Load course data dynamically each time it's requested."""
    if not os.path.exists(COURSE_CSV_PATH):
        return pd.DataFrame()
    return pd.read_csv(COURSE_CSV_PATH)

@app.route('/api/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({'message': 'Email is required'}), 400

    otp = str(random.randint(100000, 999999))
    otp_collection.update_one({"email": email}, {"$set": {"otp": otp}}, upsert=True)

    try:
        msg = Message("Your OTP Code", recipients=[email])
        msg.body = f"Your OTP code is: {otp}. It is valid for 5 minutes."
        mail.send(msg)
        return jsonify({"message": "OTP sent successfully!"}), 200
    except Exception as e:
        return jsonify({"message": "Failed to send OTP", "error": str(e)}), 500

@app.route('/api/verify-signup', methods=['POST'])
def verify_signup():
    data = request.get_json()
    email = data.get('email')
    entered_otp = data.get('otp')
    username = data.get('username')
    password = data.get('password')
    
    if not (email and entered_otp and username and password):
        return jsonify({'message': 'Missing fields'}), 400

    record = otp_collection.find_one({"email": email})
    
    if not record or record.get('otp') != entered_otp:
        return jsonify({"message": "Invalid OTP"}), 400

    hashed_password = generate_password_hash(password)
    new_user = {
        "username": username,
        "email": email,
        "password": hashed_password
    }
    users_collection.insert_one(new_user)
    otp_collection.delete_one({"email": email})
    
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
    return jsonify(df.to_dict(orient="records"))

@app.route('/api/courses/search', methods=['GET'])
def search_courses():
    query = request.args.get("query", "").lower().strip()
    rating = request.args.get("rating")
    price = request.args.get("price")
    level = request.args.get("level")
    duration = request.args.get("duration")
    page = int(request.args.get("page", 1))
    per_page = 10

    df = load_course_data()
    if df.empty:
        return jsonify({"error": "Course data not available."}), 500

    df['Rating'] = pd.to_numeric(df['Rating'], errors='coerce')
    if query:
        df = df[df['Title'].str.lower().str.contains(query) ]

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
        df = df[df['Duration'].str.lower() == duration.lower()]

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
    app.run(debug=True)