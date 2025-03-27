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
        
        # --- Clean each column ---
        # 1) CourseID: If missing or empty, generate an 8-digit random ID.
        df["CourseID"] = df["CourseID"].astype(str)
        missing_ids = df["CourseID"].isnull() | df["CourseID"].str.lower().isin(["nan", "none", "unknown", ""])
        df.loc[missing_ids, "CourseID"] = [str(np.random.randint(10000000, 99999999)) for _ in range(missing_ids.sum())]
        
        # 2) Type: If missing, randomly choose "Online" or "Offline".
        def fix_type(t):
            if pd.isnull(t) or str(t).strip().lower() in ["nan", "none", "unknown", ""]:
                return np.random.choice(["Online", "Offline"])
            return t
        df["Type"] = df["Type"].apply(fix_type)
        
        # 3) Level: If missing, randomly choose from Beginner, Intermediate, or Expert.
        def fix_level(l):
            if pd.isnull(l) or str(l).strip().lower() in ["nan", "none", "unknown", ""]:
                return np.random.choice(["Beginner", "Intermediate", "Expert"])
            return l
        df["Level"] = df["Level"].apply(fix_level)
        
        # 4) Duration: Ensure it's in the format "<number> months". Otherwise fill missing with random.
        df["Duration"] = df["Duration"].astype(str)
        # Mark durations that don't match the pattern as NaN
        invalid_duration = ~df["Duration"].str.match(r"^\d+\s*months?$", case=False)
        df.loc[invalid_duration, "Duration"] = np.nan
        missing_duration = df["Duration"].isnull() | df["Duration"].str.lower().isin(["nan", "none", "unknown", ""])
        df.loc[missing_duration, "Duration"] = [f"{np.random.randint(1, 13)} months" for _ in range(missing_duration.sum())]
        
        # 5) Price: Keep only "Free" or "Paid". If numeric or missing, choose randomly.
        def fix_price(p):
            try:
                # if conversion to float works, treat it as not valid
                float(p)
                return np.random.choice(["Free", "Paid"])
            except:
                pass
            p_str = str(p).strip().lower()
            if p_str in ["nan", "none", "", "unknown"]:
                return np.random.choice(["Free", "Paid"])
            if p_str not in ["free", "paid"]:
                return np.random.choice(["Free", "Paid"])
            return p_str.capitalize()
        df["Price"] = df["Price"].apply(fix_price)
        
        # 6) Rating: Ensure it is a float in the range 2.0 to 5.0; if out-of-range or missing, assign a random value.
        def fix_rating(r):
            if pd.isnull(r):
                return round(np.random.uniform(2, 5), 1)
            try:
                val = float(r)
                # Check if the value is still NaN after conversion or out of range
                if pd.isnull(val) or (val < 2 or val > 5):
                    return round(np.random.uniform(2, 5), 1)
                return val
            except:
                return round(np.random.uniform(2, 5), 1)

        df["Rating"] = df["Rating"].apply(fix_rating)
        
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
