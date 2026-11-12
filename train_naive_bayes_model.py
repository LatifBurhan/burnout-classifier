#!/usr/bin/env python3
"""
Training Naive Bayes Model untuk Burnout Classification
Dengan 80% Training Data dan 20% Testing Data
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import (
    accuracy_score, 
    precision_score, 
    recall_score, 
    f1_score,
    confusion_matrix,
    classification_report
)
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import json
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os

print("="*60)
print("TRAINING NAIVE BAYES MODEL - BURNOUT RISK CLASSIFIER")
print("="*60)

# 1. Load Dataset - Coba beberapa lokasi
dataset_paths = [
    "burnout_training_data.csv",
    "synthetic_employee_burnout.csv",
    "/Users/latif/Downloads/synthetic_employee_burnout.csv",
    "work_from_home_burnout_dataset-selected-columns.csv",
]

df = None
for path in dataset_paths:
    if os.path.exists(path):
        df = pd.read_csv(path)
        print(f"\n✓ Dataset loaded from: {path}")
        print(f"  Total records: {len(df)}")
        break

if df is None:
    print("\n❌ ERROR: Dataset not found!")
    print("Please provide dataset path:")
    print("  1. dataset.csv")
    print("  2. synthetic_employee_burnout.csv")
    sys.exit(1)

print(f"  Columns: {list(df.columns)}")

# 2. Preprocessing
print("\n🔄 Preprocessing data...")

# Buat kategori risiko dari burnout_score jika ada
if 'burnout_score' in df.columns:
    df['burnout_risk'] = df['burnout_score'].apply(
        lambda x: 'Low' if x < 35 else ('Medium' if x <= 65 else 'High')
    )
    print("  ✓ Created 'burnout_risk' from 'burnout_score'")
elif 'burnout_risk' not in df.columns:
    print("  ❌ ERROR: Neither 'burnout_score' nor 'burnout_risk' column found!")
    sys.exit(1)

# Convert day_type jika ada
if 'day_type' in df.columns:
    df['is_weekend'] = (df['day_type'] == 'Weekend').astype(int)
    print("  ✓ Converted 'day_type' to 'is_weekend'")
elif 'is_weekend' not in df.columns:
    print("  ⚠️  Warning: 'is_weekend' column not found, creating default values")
    df['is_weekend'] = 0

# 3. Prepare Features & Target
feature_columns = [
    'is_weekend', 
    'work_hours', 
    'screen_time_hours', 
    'meetings_count',
    'breaks_taken', 
    'after_hours_work', 
    'sleep_hours', 
    'task_completion_rate'
]

# Check if all columns exist
missing_cols = [col for col in feature_columns if col not in df.columns]
if missing_cols:
    print(f"\n❌ ERROR: Missing columns: {missing_cols}")
    print(f"Available columns: {list(df.columns)}")
    sys.exit(1)

X = df[feature_columns].values
y = df['burnout_risk'].values

print(f"\n✓ Features prepared: {X.shape}")
print(f"  Class distribution:")
for cls in ['Low', 'Medium', 'High']:
    count = (y == cls).sum()
    pct = (count / len(y)) * 100
    print(f"    {cls}: {count} ({pct:.1f}%)")

# 4. Split Data: 80% Training, 20% Testing
print(f"\n🔄 Splitting data (80% train, 20% test)...")
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,  # 20% untuk testing
    random_state=42,
    stratify=y  # Pastikan distribusi class seimbang
)

print(f"  Training: {len(X_train)} samples (80%)")
print(f"  Testing:  {len(X_test)} samples (20%)")

# 5. Train Naive Bayes Model
print(f"\n🔄 Training Gaussian Naive Bayes model...")
model = GaussianNB()
model.fit(X_train, y_train)
print(f"✓ Model trained successfully!")

# 6. Evaluate on Test Data
print(f"\n" + "="*60)
print("MODEL EVALUATION RESULTS")
print("="*60)

y_pred = model.predict(X_test)

# Calculate Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

print(f"\n📊 OVERALL METRICS:")
print(f"  Accuracy:  {accuracy:.4f} ({accuracy*100:.2f}%)")
print(f"  Precision: {precision:.4f} ({precision*100:.2f}%)")
print(f"  Recall:    {recall:.4f} ({recall*100:.2f}%)")
print(f"  F1-Score:  {f1:.4f} ({f1*100:.2f}%)")

# Detailed Classification Report
print(f"\n📋 DETAILED CLASSIFICATION REPORT:")
print(classification_report(y_test, y_pred))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred, labels=['Low', 'Medium', 'High'])
print(f"\n🔢 CONFUSION MATRIX:")
print(f"{'':>12} {'Low':>8} {'Medium':>8} {'High':>8}")
for i, label in enumerate(['Low', 'Medium', 'High']):
    print(f"  {label:>10} {cm[i][0]:>8} {cm[i][1]:>8} {cm[i][2]:>8}")

# 7. Save Metrics to JSON
metrics = {
    "model_type": "Gaussian Naive Bayes",
    "training_date": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S"),
    "dataset_size": len(df),
    "train_size": len(X_train),
    "test_size": len(X_test),
    "train_percentage": 80,
    "test_percentage": 20,
    "metrics": {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1)
    },
    "class_distribution": {
        "Low": int((y == 'Low').sum()),
        "Medium": int((y == 'Medium').sum()),
        "High": int((y == 'High').sum())
    },
    "confusion_matrix": cm.tolist()
}

with open('model_metrics.json', 'w') as f:
    json.dump(metrics, f, indent=2)
print(f"\n✓ Metrics saved to: model_metrics.json")

# 8. Visualize Confusion Matrix
try:
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Low', 'Medium', 'High'],
                yticklabels=['Low', 'Medium', 'High'],
                cbar_kws={'label': 'Count'})
    plt.title('Confusion Matrix - Naive Bayes Model\nAccuracy: {:.2f}%'.format(accuracy*100), 
              fontsize=14, fontweight='bold')
    plt.ylabel('Actual', fontsize=12)
    plt.xlabel('Predicted', fontsize=12)
    plt.tight_layout()
    plt.savefig('confusion_matrix.png', dpi=300, bbox_inches='tight')
    print(f"✓ Confusion matrix saved to: confusion_matrix.png")
except Exception as e:
    print(f"⚠️  Could not save confusion matrix plot: {e}")

# 9. Export to ONNX dengan output tensor (bukan zipmap/dict)
print(f"\n🔄 Converting model to ONNX format...")
from skl2onnx.common.data_types import FloatTensorType, StringTensorType

initial_type = [('float_input', FloatTensorType([None, 8]))]

# PENTING: zipmap=False agar output tensor biasa, bukan dictionary
onnx_model = convert_sklearn(
    model,
    initial_types=initial_type,
    target_opset=12,
    options={id(model): {'zipmap': False}}
)

with open("burnout_model_naive_bayes.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print(f"✓ ONNX model saved to: burnout_model_naive_bayes.onnx")

# 10. Test ONNX Model
print(f"\n🧪 Testing ONNX model...")
try:
    import onnxruntime as ort
    
    session = ort.InferenceSession("burnout_model_naive_bayes.onnx")
    test_input = X_test[:5].astype(np.float32)
    input_name = session.get_inputs()[0].name
    result = session.run(None, {input_name: test_input})
    
    print(f"✓ ONNX model working correctly!")
    print(f"  Sample predictions shape: {result[0].shape}")
    
    # Show sample predictions
    risk_labels = ['Low', 'Medium', 'High']
    print(f"\n  Sample predictions:")
    for i in range(min(5, len(result[0]))):
        pred_idx = np.argmax(result[0][i])
        actual = y_test[i]
        pred = risk_labels[pred_idx]
        match = "✓" if pred == actual else "✗"
        print(f"    {match} Actual: {actual:8s} | Predicted: {pred:8s}")
        
except Exception as e:
    print(f"⚠️  ONNX test warning: {e}")

# Summary
print(f"\n" + "="*60)
print("✅ TRAINING COMPLETE!")
print("="*60)
print(f"\nFiles generated:")
print(f"  1. burnout_model_naive_bayes.onnx - Model file")
print(f"  2. model_metrics.json - Performance metrics")
print(f"  3. confusion_matrix.png - Visualization")
print(f"\n📊 Model Performance:")
print(f"  Accuracy:  {accuracy*100:.2f}%")
print(f"  Precision: {precision*100:.2f}%")
print(f"  Recall:    {recall*100:.2f}%")
print(f"  F1-Score:  {f1*100:.2f}%")
print(f"\n📝 Next steps:")
print(f"  1. Copy files to project:")
print(f"     cp burnout_model_naive_bayes.onnx public/burnout_model.onnx")
print(f"     cp model_metrics.json public/")
print(f"  2. Restart the application:")
print(f"     npm run dev")
print(f"  3. Access metrics page:")
print(f"     http://localhost:3000/metrics")
print("="*60)
