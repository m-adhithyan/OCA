import pandas as pd
import numpy as np

# Load the CSV file into a DataFrame
df = pd.read_csv('cleaned_merged_file.csv')

# Handle the 'Duration' column
# Remove 'unknown' values and decimal values
df['Duration'] = df['Duration'].replace('unknown', np.nan)

# Ensure the 'Duration' column is of string type for consistency
df['Duration'] = df['Duration'].astype(str)

# Function to check if a value is a valid integer duration
def is_valid_duration(duration):
    try:
        # Remove the word 'months' and convert the remaining part to an integer
        duration_value = int(duration.replace('months', '').strip())
        return True
    except ValueError:
        return False

# Apply the function to identify invalid durations
df['Duration'] = df['Duration'].apply(lambda x: np.nan if not is_valid_duration(x) else x)

# Fill missing values with random durations between 1 month and 12 months
def random_duration():
    return f"{np.random.randint(1, 13)} months"

# Apply the random duration function to missing values
df['Duration'] = df['Duration'].apply(lambda x: random_duration() if pd.isnull(x) else x)

# Save the updated DataFrame to a new CSV file
df.to_csv('courses_fixed_merged1.csv', index=False)
print("Updated dataset saved successfully.")