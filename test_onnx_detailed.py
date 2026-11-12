#!/usr/bin/env python3
"""
Test ONNX model output format untuk debug
"""

import onnxruntime as ort
import numpy as np

print("="*60)
print("TESTING ONNX MODEL OUTPUT FORMAT")
print("="*60)

# Load model
session = ort.InferenceSession("burnout_model_naive_bayes.onnx")

# Print model info
print("\n📋 MODEL INFO:")
print(f"  Inputs: {[inp.name for inp in session.get_inputs()]}")
print(f"  Outputs: {[out.name for out in session.get_outputs()]}")

print("\n📋 INPUT DETAILS:")
for inp in session.get_inputs():
    print(f"  Name: {inp.name}")
    print(f"  Shape: {inp.shape}")
    print(f"  Type: {inp.type}")

print("\n📋 OUTPUT DETAILS:")
for out in session.get_outputs():
    print(f"  Name: {out.name}")
    print(f"  Shape: {out.shape}")
    print(f"  Type: {out.type}")

# Test dengan beberapa sample data
test_cases = [
    {
        "name": "Low Risk Sample",
        "data": [0, 6, 5, 2, 4, 0, 8, 0.85],  # weekend=no, work=6h, screen=5h, meetings=2, breaks=4, after=0h, sleep=8h, task=85%
    },
    {
        "name": "Medium Risk Sample",
        "data": [0, 9, 8, 5, 2, 2, 6, 0.70],  # work=9h, screen=8h, meetings=5, breaks=2, after=2h, sleep=6h, task=70%
    },
    {
        "name": "High Risk Sample",
        "data": [1, 12, 10, 8, 1, 4, 4, 0.50],  # weekend=yes, work=12h, screen=10h, meetings=8, breaks=1, after=4h, sleep=4h, task=50%
    },
]

print("\n" + "="*60)
print("PREDICTION TESTS")
print("="*60)

for i, test in enumerate(test_cases, 1):
    print(f"\n🧪 TEST {i}: {test['name']}")
    print(f"  Input: {test['data']}")
    
    # Prepare input
    input_array = np.array([test['data']], dtype=np.float32)
    input_name = session.get_inputs()[0].name
    
    # Run prediction
    results = session.run(None, {input_name: input_array})
    
    # Print all outputs
    print(f"\n  📤 OUTPUTS ({len(results)} outputs):")
    for j, result in enumerate(results):
        print(f"    Output {j}:")
        print(f"      Type: {type(result)}")
        print(f"      Shape: {result.shape if hasattr(result, 'shape') else 'N/A'}")
        print(f"      Data type: {result.dtype if hasattr(result, 'dtype') else 'N/A'}")
        print(f"      Value: {result}")
        
        # If it's array-like, print probabilities
        if hasattr(result, '__iter__') and not isinstance(result, str):
            try:
                flat = np.array(result).flatten()
                if len(flat) == 3:  # Probably probabilities for 3 classes
                    labels = ['High', 'Low', 'Medium']  # Alphabetical order
                    print(f"\n      Interpreted as probabilities:")
                    for k, (label, prob) in enumerate(zip(labels, flat)):
                        print(f"        {label}: {prob:.4f} ({prob*100:.2f}%)")
                    
                    # Predicted class
                    pred_idx = np.argmax(flat)
                    pred_label = labels[pred_idx]
                    confidence = flat[pred_idx]
                    print(f"\n      ➡️  Predicted: {pred_label} (confidence: {confidence:.4f})")
            except:
                pass

print("\n" + "="*60)
print("✅ TEST COMPLETE")
print("="*60)
