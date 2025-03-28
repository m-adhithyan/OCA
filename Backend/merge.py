import os
import pandas as pd
import numpy as np
import re
import sys

# Set UTF-8 encoding for console output
sys.stdout.reconfigure(encoding='utf-8')

# File paths
ORG_DATA_DIR = os.path.join(os.getcwd(), "Org Data")  # Adjust as needed; Org Data is in the backend folder
UPDATED_FILE_PATH = os.path.join(os.getcwd(), "updated_cleaned_merged_file.csv")

# Standardized column names mapping (handles variations)
COLUMN_MAPPING = {
    "course_id": "CourseID",
    "Course ID": "CourseID",
    "course_title": "Title",
    "Course Name": "Title",
    "title": "Title",
    "Type": "Type",
    "technology": "Type",
    "Description": "Description",
    "description": "Description",
    "Level": "Level",
    "level": "Level",
    "Duration": "Duration",
    "content_duration": "Duration",
    "Rating": "Rating",
    "Review Count": "Review Count",
    "num_reviews": "Review Count",
    "Skills Covered": "Skills Covered",
    "Prerequisites": "Prerequisites",
    "Affiliates": "Affiliates",
    "URL": "URL",
    "url": "URL",
    "urlcourse": "URL",
    "price": "Price",
    "cost": "Price",
}

# Final required columns
REQUIRED_COLUMNS = ["CourseID", "Title", "Type", "Description", "Level", "Duration", "Rating", "Price", "URL"]

print(f"📁 Checking Org Data directory: {ORG_DATA_DIR}")

if not os.path.exists(ORG_DATA_DIR):
    print(f"⚠️ Directory not found: {ORG_DATA_DIR}")
    exit()

csv_files = [f for f in os.listdir(ORG_DATA_DIR) if f.endswith(".csv")]
print(f"📂 Found CSV files: {csv_files}")

if not csv_files:
    print("⚠️ No CSV files found!")
    exit()

df_list = []
for file in csv_files:
    file_path = os.path.join(ORG_DATA_DIR, file)
    print(f"🔍 Processing: {file}")

    try:
        df = pd.read_csv(file_path)
        
        # Rename columns using the mapping
        df.rename(columns=COLUMN_MAPPING, inplace=True)
        
        # Ensure every required column exists; if missing, create with NaN
        for col in REQUIRED_COLUMNS:
            if col not in df.columns:
                df[col] = np.nan
        
        # Keep only the required columns (maintaining order)
        df = df[REQUIRED_COLUMNS]
        
        # Remove rows with missing Title (course name)
        df = df[df["Title"].notnull() & (df["Title"].str.strip() != "")]

        # 1) CourseID: If missing or empty, generate an 8-digit random ID.
        df["CourseID"] = df["CourseID"].astype(str)
        missing_ids = df["CourseID"].isnull() | df["CourseID"].str.lower().isin(["nan", "none", "unknown", ""])
        df.loc[missing_ids, "CourseID"] = [str(np.random.randint(10000000, 99999999)) for _ in range(missing_ids.sum())]

        # 2) Type: If missing, randomly choose "Online" or "Offline".
        df["Type"] = df["Type"].apply(lambda t: np.random.choice(["Online", "Offline"]) if pd.isnull(t) or str(t).strip().lower() in ["nan", "none", "unknown", ""] else t)

        # 3) Level: If missing, randomly choose from Beginner, Intermediate, or Expert.
        df["Level"] = df["Level"].apply(lambda l: np.random.choice(["Beginner", "Intermediate", "Expert"]) if pd.isnull(l) or str(l).strip().lower() in ["nan", "none", "unknown", ""] else l)

        # 4) Duration: Ensure it's in the format "<number> months".
        df["Duration"] = df["Duration"].astype(str)
        invalid_duration = ~df["Duration"].str.match(r"^\d+\s*months?$", case=False)
        df.loc[invalid_duration, "Duration"] = np.nan
        missing_duration = df["Duration"].isnull() | df["Duration"].str.lower().isin(["nan", "none", "unknown", ""])
        df.loc[missing_duration, "Duration"] = [f"{np.random.randint(1, 13)} months" for _ in range(missing_duration.sum())]

        # 5) Price: Keep only "Free" or "Paid".
        def fix_price(p):
            try:
                float(p)
                return np.random.choice(["Free", "Paid"])
            except:
                pass
            p_str = str(p).strip().lower()
            return "Paid" if p_str not in ["free", "paid"] else p_str.capitalize()
        df["Price"] = df["Price"].apply(fix_price)

        # 6) Rating: Ensure it's between 2.0 and 5.0.
        def fix_rating(r):
            try:
                val = float(r)
                return round(np.random.uniform(2, 5), 1) if pd.isnull(val) or (val < 2 or val > 5) else val
            except:
                return round(np.random.uniform(2, 5), 1)
        df["Rating"] = df["Rating"].apply(fix_rating)

        # 7) Description: If missing, add "Click here to go to the course"
        df["Description"] = df["Description"].fillna("Click here to go to the course")
        df.loc[df["Description"].str.strip() == "", "Description"] = "Click here to go to the course"

        # Append cleaned DataFrame to list
        df_list.append(df)
        print(f"✅ Loaded {len(df)} rows from {file}")
        
    except Exception as e:
        print(f"❌ Error reading {file}: {e}")

if df_list:
    merged_df = pd.concat(df_list, ignore_index=True)
    merged_df.to_csv(UPDATED_FILE_PATH, index=False)
    print(f"✅ Final cleaned dataset saved to: {UPDATED_FILE_PATH}")
else:
    print("⚠️ No valid CSV data to merge!")
