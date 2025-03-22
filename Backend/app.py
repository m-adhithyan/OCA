from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)


try:
    client = MongoClient("mongodb://localhost:27017/")
    db = client["user_database"]
    users_collection = db["users"]
    print("✅ Database connected successfully!")
except Exception as e:
    print(f"❌ Failed to connect to database: {e}")


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


if __name__ == "__main__":
    print("🚀 Server running at http://localhost:5000")
    app.run(debug=True)