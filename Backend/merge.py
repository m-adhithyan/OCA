import pandas as pd
import os

# Define the folder where CSV files are stored
csv_folder = "Org Data"

# Get all CSV files in the folder
csv_files = [file for file in os.listdir(csv_folder) if file.endswith(".csv")]

# Standard column mapping
column_mapping = {
    "course_id": "CourseID",
    "course_title": "Title",
    "title": "Title",
    "technology": "Type",
    "subject": "Type",
    "description": "Description",
    "level": "Level",
    "content_duration": "Duration",
    "Rating": "Rating",
    "num_reviews": "Review Count",
    "review_count": "Review Count",
    "skills_covered": "Skills Covered",
    "prerequisites": "Prerequisites",
    "affiliates": "Affiliates",
    "url": "URL",
    "price": "Price",
    "num_subscribers": "Subscribers",
    "num_lectures": "Lectures",
    "published_timestamp": "Published Date",
}

# Desired column order
desired_columns = ["CourseID", "Title", "Type", "Description", "Level", "Duration", "Rating", 
                   "Review Count", "Skills Covered", "Prerequisites", "Affiliates", "Price",
                   "Subscribers", "Lectures", "Published Date", "URL"]

# List to store processed DataFrames
df_list = []

for file in csv_files:
    file_path = os.path.join(csv_folder, file)
    
    try:
        df = pd.read_csv(file_path)
        
        # Rename columns based on the mapping
        df.rename(columns={col: column_mapping[col] for col in df.columns if col in column_mapping}, inplace=True)
        
        # Add missing columns with default value
        for col in desired_columns:
            if col not in df.columns:
                df[col] = "Unknown"  # Default value for missing data
        
        # Reorder columns
        df = df[desired_columns]
        
        df_list.append(df)
        print(f"✅ Processed: {file}")
    
    except Exception as e:
        print(f"❌ Error processing {file}: {e}")

# Merge all cleaned data
if df_list:
    merged_df = pd.concat(df_list, ignore_index=True)

    # Remove duplicate courses if any, keeping the first occurrence
    merged_df.drop_duplicates(subset=["CourseID", "Title", "URL"], keep="first", inplace=True)

    # Save merged file
    merged_file_path =  "cleaned_merged_file.csv"
    merged_df.to_csv(merged_file_path, index=False)

    print(f"✅ All CSV files merged successfully! Saved at: {merged_file_path}")
else:
    print("❌ No valid CSV files found to merge.")
