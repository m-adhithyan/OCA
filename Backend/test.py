import pandas as pd

df = pd.read_csv('courses_fixed.csv')
df.drop('Type', axis=1, inplace=True)

print(df.head(5))