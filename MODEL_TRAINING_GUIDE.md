# Model Training Guide

## 📚 Panduan Training Model ONNX untuk Burnout Risk Classifier

Guide ini menjelaskan cara membuat model ONNX yang compatible dengan aplikasi.

## 🎯 Model Requirements

### Input Specification
- **Shape**: `[batch_size, 8]`
- **Type**: `float32`
- **Features** (dalam urutan):
  1. `is_weekend` (0 atau 1)
  2. `work_hours` (0-24)
  3. `screen_time_hours` (0-24)
  4. `meetings_count` (0+)
  5. `breaks_taken` (0+)
  6. `after_hours_work` (0 atau 1)
  7. `sleep_hours` (0-24)
  8. `task_completion_rate` (0.0-1.0)

### Output Specification
- **Shape**: `[batch_size, 3]`
- **Type**: `float32`
- **Classes**:
  - Index 0: Low Risk
  - Index 1: Medium Risk
  - Index 2: High Risk

## 🐍 Python Training Example

### 1. Install Dependencies

```bash
pip install scikit-learn pandas numpy onnx skl2onnx
```

### 2. Sample Training Script

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Load your data
# Contoh data (replace dengan data asli Anda)
data = {
    'is_weekend': [0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
    'work_hours': [8, 4, 10, 9, 3, 11, 7, 5, 12, 8.5],
    'screen_time_hours': [6, 3, 9, 8, 2, 10, 5, 4, 11, 7],
    'meetings_count': [3, 1, 5, 4, 0, 6, 2, 1, 7, 3],
    'breaks_taken': [2, 3, 1, 2, 4, 1, 3, 3, 0, 2],
    'after_hours_work': [0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
    'sleep_hours': [7, 8, 6, 6.5, 9, 5, 8, 7.5, 5.5, 7],
    'task_completion_rate': [0.85, 0.90, 0.75, 0.80, 0.95, 0.70, 0.88, 0.92, 0.65, 0.83],
    'risk_level': [0, 0, 2, 1, 0, 2, 0, 0, 2, 1]  # 0=Low, 1=Medium, 2=High
}

df = pd.DataFrame(data)

# Prepare features and target
X = df.drop('risk_level', axis=1)
y = df['risk_level']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy:.2f}")

# Convert to ONNX
initial_type = [('float_input', FloatTensorType([None, 8]))]
onnx_model = convert_sklearn(
    model,
    initial_types=initial_type,
    target_opset=12
)

# Save ONNX model
with open("burnout_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())

print("Model saved as burnout_model.onnx")
```

### 3. Verify ONNX Model

```python
import onnxruntime as ort
import numpy as np

# Load model
session = ort.InferenceSession("burnout_model.onnx")

# Test prediction
test_input = np.array([[0, 8, 6, 3, 2, 0, 7, 0.85]], dtype=np.float32)
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

result = session.run([output_name], {input_name: test_input})
print(f"Prediction: {result}")
```

## 🧠 Alternative Models

### TensorFlow/Keras to ONNX

```python
import tensorflow as tf
import tf2onnx

# Train your Keras model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(8,)),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(3, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(X_train, y_train, epochs=50, validation_split=0.2)

# Convert to ONNX
spec = (tf.TensorSpec((None, 8), tf.float32, name="input"),)
output_path = "burnout_model.onnx"

model_proto, _ = tf2onnx.convert.from_keras(
    model,
    input_signature=spec,
    opset=13,
    output_path=output_path
)

print(f"Model saved to {output_path}")
```

### PyTorch to ONNX

```python
import torch
import torch.nn as nn

# Define model
class BurnoutClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(8, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 3)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)
    
    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# Train model (simplified)
model = BurnoutClassifier()
# ... training code ...

# Export to ONNX
dummy_input = torch.randn(1, 8)
torch.onnx.export(
    model,
    dummy_input,
    "burnout_model.onnx",
    export_params=True,
    opset_version=12,
    input_names=['input'],
    output_names=['output'],
    dynamic_axes={
        'input': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)
```

## 📊 Dataset Requirements

### Minimum Dataset Size
- **Training**: Minimal 1000 sampel (recommended 5000+)
- **Validation**: 20% dari training data
- **Test**: 20% dari total data

### Data Quality
- ✅ Balanced classes (atau gunakan class weights)
- ✅ No missing values
- ✅ Normalized features (jika perlu)
- ✅ No outliers yang ekstrem

### Sample Dataset Structure

```csv
is_weekend,work_hours,screen_time_hours,meetings_count,breaks_taken,after_hours_work,sleep_hours,task_completion_rate,risk_level
0,8,6,3,2,0,7,0.85,0
1,4,3,1,3,0,8,0.90,0
0,10,9,5,1,1,6,0.75,2
0,9,8,4,2,1,6.5,0.80,1
```

## 🎯 Model Performance Targets

- **Accuracy**: > 80%
- **Precision**: > 75% for each class
- **Recall**: > 75% for each class
- **F1-Score**: > 75%

## 🔍 Model Validation

### 1. Check Model Structure

```python
import onnx

model = onnx.load("burnout_model.onnx")
onnx.checker.check_model(model)
print("✓ Model is valid")

# Print model info
print(f"Input: {model.graph.input[0].name}")
print(f"Output: {model.graph.output[0].name}")
```

### 2. Test with Sample Data

```python
import onnxruntime as ort
import numpy as np

session = ort.InferenceSession("burnout_model.onnx")

# Test cases
test_cases = [
    [0, 8, 6, 3, 2, 0, 7, 0.85],  # Expected: Low
    [0, 10, 9, 5, 1, 1, 6, 0.75], # Expected: High
    [0, 9, 8, 4, 2, 1, 6.5, 0.80] # Expected: Medium
]

for i, test in enumerate(test_cases):
    input_data = np.array([test], dtype=np.float32)
    result = session.run(None, {session.get_inputs()[0].name: input_data})
    predicted_class = np.argmax(result[0])
    risk_levels = ['Low', 'Medium', 'High']
    print(f"Test {i+1}: Predicted {risk_levels[predicted_class]}")
```

## 📦 Final Steps

1. **Test model** dengan berbagai input
2. **Verify accuracy** dengan test dataset
3. **Check file size** (recommended < 50MB)
4. **Save model** di `public/burnout_model.onnx`
5. **Document** model metrics dan training parameters

## 🚨 Common Issues

### Issue: Model output shape mismatch
**Solution**: Pastikan output shape adalah `[batch_size, 3]`

### Issue: Wrong data type
**Solution**: Pastikan input dan output type adalah `float32`

### Issue: Model too large
**Solution**: 
- Reduce model complexity
- Use pruning
- Quantize model

### Issue: Poor accuracy
**Solution**:
- Collect more data
- Feature engineering
- Try different algorithms
- Tune hyperparameters

## 📚 Resources

- [ONNX Documentation](https://onnx.ai/onnx/)
- [ONNX Runtime](https://onnxruntime.ai/)
- [scikit-learn to ONNX](https://github.com/onnx/sklearn-onnx)
- [PyTorch ONNX Export](https://pytorch.org/docs/stable/onnx.html)
- [TensorFlow to ONNX](https://github.com/onnx/tensorflow-onnx)

## 🎉 Success Checklist

- [ ] Model trained dengan data yang cukup
- [ ] Accuracy > 80%
- [ ] Model di-convert ke ONNX
- [ ] ONNX model di-validate
- [ ] Test dengan sample data berhasil
- [ ] File size reasonable
- [ ] Model disimpan di lokasi yang benar
- [ ] Dokumentasi training parameters

Selamat! Model Anda siap digunakan! 🚀
