import requests

# API URL
url = "https://collection-for-coursera-courses.p.rapidapi.com/rapidapi/course/get_institution.php"

# API Headers
headers = {
    "x-rapidapi-key": "f9daf1cdd0msh1f2b79a3f7a157ap132c62jsn716af1055250",
    "x-rapidapi-host": "collection-for-coursera-courses.p.rapidapi.com"
}

# Send GET request
response = requests.get(url, headers=headers)

# Check if request was successful
if response.status_code == 200:
    # Convert response to JSON
    data = response.json()

    # 🔍 Print raw response and inspect it closely
    print("Full Raw Response:", data)

else:
    print("❌ Failed to fetch data. Status Code:", response.status_code)



