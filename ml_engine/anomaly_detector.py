import json
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

# Load the generated projects
with open('projects.json', 'r') as f:
    data = json.load(f)

# Extract features
df = pd.DataFrame(data)

# Create some calculated features for the ML model
df['spent_ratio'] = df.apply(lambda row: row['spent'] / row['budget'] if row['budget'] > 0 else 0, axis=1)

# Count vendor density per state
vendor_counts = df.groupby(['contractor', 'state']).size().reset_index(name='vendor_density')
df = pd.merge(df, vendor_counts, on=['contractor', 'state'], how='left')

# Hardcode duration for mock since we used static dates
df['duration_days'] = 365 

features = df[['budget', 'spent_ratio', 'duration_days', 'vendor_density']]

# Train Isolation Forest (Unsupervised Anomaly Detection)
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(features)

# Predict (-1 is anomaly, 1 is normal)
predictions = model.predict(features)
scores = model.decision_function(features)

results = {}
for i, row in df.iterrows():
    base_score = float(-scores[i])
    risk_percent = max(0, min(100, int((base_score + 0.5) * 100)))
    
    is_anomaly = predictions[i] == -1
    
    insights = []
    if is_anomaly:
        if row['spent_ratio'] > 1.0:
            insights.append("ML_FLAG: Critical cost overrun detected (Spent > Budget).")
        if row['vendor_density'] >= 4:
            insights.append("ML_FLAG: Contractor monopoly detected in region.")
            
    results[row['id']] = {
        'ml_risk_score': risk_percent,
        'is_anomaly': bool(is_anomaly),
        'ai_insights': insights
    }

# Save to the React app's data folder
output_path = '../src/data/ml_insights.json'
with open(output_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"ML Model trained on {len(df)} projects! Insights exported to {output_path}")
