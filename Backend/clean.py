import pandas as pd
import re

# Load the CSV file into a DataFrame
df = pd.read_csv('cleaned_merged_file.csv')

# Function to convert duration to days
def convert_duration_to_days(duration):
    # Check if duration is a string
    if isinstance(duration, str):
        # Regular expression to extract numeric values and units
        months = re.findall(r'(\d+)\s*months?', duration, re.IGNORECASE)
        weeks = re.findall(r'(\d+)\s*weeks?', duration, re.IGNORECASE)
        days = re.findall(r'(\d+)\s*days?', duration, re.IGNORECASE)
        
        # Convert to integers
        months = [int(m) for m in months]
        weeks = [int(w) for w in weeks]
        days = [int(d) for d in days]
        
        # Calculate total days
        total_days = sum(months) * 30 + sum(weeks) * 7 + sum(days)
        return total_days
    else:
        # If duration is not a string, return None or a default value
        return None

# Apply the function to the 'Duration' column
df['DurationInDays'] = df['Duration'].apply(convert_duration_to_days)

# Save the updated DataFrame to a new CSV file
df.to_csv('courses_duration_in_days.csv', index=False)
print("Updated dataset saved successfully.")