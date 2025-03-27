import requests

BASE_URL = "http://localhost:5000/api/courses"

def test_get_all_courses():
    response = requests.get(BASE_URL)
    print("✅ GET /api/courses Response:", response.status_code)
    print(response.json()[:3])  # Display first 3 courses

def test_search_courses(query):
    response = requests.get(f"{BASE_URL}/search", params={"query": query})
    print(f"✅ GET /api/courses/search?query={query} Response:", response.status_code)
    print(response.json()[:3])  # Display first 3 matched courses

if __name__ == "__main__":
    print("🔍 Testing API Endpoints...\n")
    
    #test_get_all_courses()
    test_search_courses("full stack")  # Example: Searching for fullstack courses
