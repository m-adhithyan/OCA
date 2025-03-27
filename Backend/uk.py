import pandas as pd
import numpy as np
import os
import sys

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# File paths
file_path = r"C:\Users\Hp\Documents\GitHub\OCA\Backend\cleaned_merged_file.csv"
updated_file_path = r"C:\Users\Hp\Documents\GitHub\OCA\Backend\updated_cleaned_merged_file_v3.csv"

# Read the CSV file
df = pd.read_csv(file_path)

# Generate random CourseID where it's 'Unknown'
mask = df['CourseID'] == 'Unknown'  # Identify rows with 'Unknown' CourseID
num_unknowns = mask.sum()  # Count how many unknown values need to be replaced

# Generate random numeric CourseIDs of length 8 (only numbers, no letters)
random_ids = [str(np.random.randint(10000000, 99999999)) for _ in range(num_unknowns)]

# Assign the generated random IDs to 'Unknown' rows
df.loc[mask, 'CourseID'] = random_ids

# Check if the file exists and delete if necessary
if os.path.exists(updated_file_path):
    os.remove(updated_file_path)  # Delete the locked file if it exists
    print(f"⚠️ Previous file '{updated_file_path}' deleted successfully.")

# Save the updated file
df.to_csv(updated_file_path, index=False)

# Print success message
print(f"✅ Updated file saved to: {updated_file_path}")
