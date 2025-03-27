import requests
from bs4 import BeautifulSoup

# Function to scrape Coursera course details
def scrape_coursera_courses():
    # URL of the Coursera page with course details
    url = "https://www.coursera.org/courses?query=python"  # Example: Python courses

    # Send GET request
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, "html.parser")
        
        # Find all course containers on the page
        courses = soup.find_all("div", class_="card-info vertical-box")

        for course in courses:
            # Extract course name
            course_name = course.find("h2", class_="color-primary-text").get_text(strip=True)
            
            # Extract the course URL (if available)
            course_url = "https://www.coursera.org" + course.find("a", class_="rc-DesktopSearchCard anchor-wrapper")["href"]
            
            # Extract course description (if available)
            course_description = course.find("p", class_="color-secondary-text").get_text(strip=True)
            
            # Print course details
            print("📚 Course Name:", course_name)
            print("🔗 Course Link:", course_url)
            print("📝 Description:", course_description)
            print("=" * 50)

    else:
        print(f"❌ Failed to fetch data. Status Code: {response.status_code}")

# Call the function
scrape_coursera_courses()
