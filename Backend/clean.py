import pandas as pd
import numpy as np

# Load the CSV file into a DataFrame
df = pd.read_csv('cleaned_courses.csv')

# Convert the 'Rating' column to float to handle decimal values
df['Rating'] = df['Rating'].astype(float)

# Check for missing values in the 'Rating' column
if df['Rating'].isnull().any():
    # Fill missing values with a random number between 2 and 5, rounded to one decimal place
    df['Rating'] = df['Rating'].apply(
        lambda x: round(np.random.uniform(2, 5), 1) if pd.isnull(x) else x
    )

# Ensure all values in the 'Rating' column have at least one decimal place
df['Rating'] = df['Rating'].apply(lambda x: f"{x:.1f}")

# Save the updated DataFrame to a new CSV file
df.to_csv('courses_fixed.csv', index=False)
print("Updated dataset saved successfully.")