#!/usr/bin/env python3
"""
Generate synthetic training data dengan burnout labels
"""

import pandas as pd
import numpy as np

print("📊 Generating synthetic training data...")

# Generate data
np.random.seed(42)
n_samples = 1000

data = {
    'employee_id': [f'EMP{i:04d}' for i in range(n_samples)],
    'is_weekend': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
    'work_hours': np.random.normal(8, 2, n_samples).clip(2, 14),
    'screen_time_hours': np.random.normal(6, 2, n_samples).clip(1, 12),
    'meetings_count': np.random.poisson(3, n_samples).clip(0, 10),
    'breaks_taken': np.random.poisson(2, n_samples).clip(0, 6),
    'after_hours_work': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
    'sleep_hours': np.random.normal(7, 1, n_samples).clip(4, 10),
    'task_completion_rate': np.random.beta(8, 2, n_samples).clip(0.3, 1.0)
}

df = pd.DataFrame(data)

# Calculate burnout score based on features
def calculate_burnout_score(row):
    score = 0
    
    # High work hours increases risk
    if row['work_hours'] > 9:
        score += 25
    elif row['work_hours'] > 8:
        score += 10
    
    # High screen time increases risk
    if row['screen_time_hours'] > 8:
        score += 20
    elif row['screen_time_hours'] > 6:
        score += 10
    
    # Too many meetings increases risk
    if row['meetings_count'] > 5:
        score += 15
    elif row['meetings_count'] > 3:
        score += 5
    
    # Low breaks increases risk
    if row['breaks_taken'] < 2:
        score += 15
    
    # After hours work increases risk
    if row['after_hours_work'] == 1:
        score += 20
    
    # Low sleep increases risk
    if row['sleep_hours'] < 6:
        score += 25
    elif row['sleep_hours'] < 7:
        score += 10
    
    # Low task completion increases stress
    if row['task_completion_rate'] < 0.7:
        score += 15
    elif row['task_completion_rate'] < 0.8:
        score += 5
    
    # Add some randomness
    score += np.random.randint(-10, 10)
    
    return max(0, min(100, score))

df['burnout_score'] = df.apply(calculate_burnout_score, axis=1)
df['burnout_risk'] = df['burnout_score'].apply(
    lambda x: 'Low' if x < 35 else ('Medium' if x <= 65 else 'High')
)

# Show distribution
print(f"\n✓ Generated {len(df)} samples")
print(f"\nClass distribution:")
for cls in ['Low', 'Medium', 'High']:
    count = (df['burnout_risk'] == cls).sum()
    pct = (count / len(df)) * 100
    print(f"  {cls}: {count} ({pct:.1f}%)")

print(f"\nBurnout score statistics:")
print(f"  Mean: {df['burnout_score'].mean():.2f}")
print(f"  Min:  {df['burnout_score'].min():.0f}")
print(f"  Max:  {df['burnout_score'].max():.0f}")

# Save
df.to_csv('burnout_training_data.csv', index=False)
print(f"\n✓ Saved to: burnout_training_data.csv")

# Show sample
print(f"\nSample data:")
print(df.head(10).to_string())
