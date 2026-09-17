import json
import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

# We will simulate feature extraction from the MPLADS projects.
# Features: Budget, Spent Ratio, Days Since Start, Contractor Project Count

data = [
    {'id': 'PRJ-2023-001', 'budget': 15000000, 'spent_ratio': 0.8, 'duration_days': 120, 'vendor_density': 1},
    {'id': 'PRJ-2023-002', 'budget': 8000000, 'spent_ratio': 1.0, 'duration_days': 45, 'vendor_density': 4}, # Anomaly! Fast completion, high vendor density
    {'id': 'PRJ-2023-003', 'budget': 5000000, 'spent_ratio': 0.9, 'duration_days': 400, 'vendor_density': 1}, # Anomaly! High spent ratio but extremely delayed
    {'id': 'PRJ-2023-004', 'budget': 2000000, 'spent_ratio': 0.4, 'duration_days': 60, 'vendor_density': 2},
    {'id': 'PRJ-2023-005', 'budget': 12000000, 'spent_ratio': 0.95, 'duration_days': 30, 'vendor_density': 4}, # Anomaly! Too fast, high spend
    {'id': 'PRJ-2023-006', 'budget': 3500000, 'spent_ratio': 0.2, 'duration_days': 30, 'vendor_density': 1},
    {'id': 'PRJ-2023-007', 'budget': 4500000, 'spent_ratio': 0.5, 'duration_days': 90, 'vendor_density': 2},
    {'id': 'PRJ-2023-008', 'budget': 9000000, 'spent_ratio': 0.1, 'duration_days': 15, 'vendor_density': 1},
]

df = pd.DataFrame(data)
features = df[['budget', 'spent_ratio', 'duration_days', 'vendor_density']]

# Train Isolation Forest (Unsupervised Anomaly Detection)
model = IsolationForest(contamination=0.3, random_state=42)
model.fit(features)

# Predict (-1 is anomaly, 1 is normal)
predictions = model.predict(features)
# Get anomaly scores (lower is more anomalous, we invert it for 0-100 risk score)
scores = model.decision_function(features)

results = {}
for i, row in df.iterrows():
    # Normalize score to 0-100 where 100 is highest risk
    base_score = float(-scores[i])
    risk_percent = max(0, min(100, int((base_score + 0.5) * 100)))
    
    is_anomaly = predictions[i] == -1
    
    insights = []
    if is_anomaly:
        if row['duration_days'] < 50 and row['spent_ratio'] > 0.8:
            insights.append("ML_FLAG: Impossible completion timeline vs funds disbursed.")
        if row['vendor_density'] >= 3:
            insights.append("ML_FLAG: Contractor monopoly detected in region.")
        if row['duration_days'] > 300:
            insights.append("ML_FLAG: Severe timeline deviation from baseline models.")
            
    results[row['id']] = {
        'ml_risk_score': risk_percent,
        'is_anomaly': bool(is_anomaly),
        'ai_insights': insights
    }

# Save to the React app's data folder
output_path = '../src/data/ml_insights.json'
with open(output_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"ML Model trained! Insights exported to {output_path}")
