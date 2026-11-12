# ONNX Model Troubleshooting Guide

## Error: "Non tensor type is temporarily not supported"

Ini adalah error yang umum terjadi ketika model ONNX memiliki output type yang tidak standar.

### Penyebab:
- Model memiliki output type selain tensor (misalnya: sequence, map, atau custom type)
- Model di-export dengan ZipMap atau Label encoder yang menghasilkan non-tensor output
- Model menggunakan opset yang tidak kompatibel

### Solusi:

#### Option 1: Re-export Model dengan Output yang Benar

Jika Anda bisa re-train atau re-export model, gunakan script berikut:

```python
import onnx
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Training code...
model = YourModel()
model.fit(X_train, y_train)

# Convert dengan options yang tepat
initial_type = [('float_input', FloatTensorType([None, 8]))]

# IMPORTANT: Set options untuk raw scores (tensor output)
onnx_model = convert_sklearn(
    model,
    initial_types=initial_type,
    target_opset=12,
    options={
        'zipmap': False,  # Disable ZipMap (causes non-tensor output)
        'raw_scores': True  # Use raw scores instead of probabilities
    }
)

# Save
with open("burnout_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
```

#### Option 2: Menggunakan onnx-simplifier

Install onnx-simplifier:
```bash
pip install onnx-simplifier
```

Simplify model:
```python
import onnx
from onnxsim import simplify

# Load model
model = onnx.load("burnout_model.onnx")

# Simplify
model_simplified, check = simplify(model)

# Save
onnx.save(model_simplified, "burnout_model_simplified.onnx")
```

#### Option 3: Remove ZipMap Node

Jika model memiliki ZipMap node, remove dengan script ini:

```python
import onnx
from onnx import helper

# Load model
model = onnx.load("burnout_model.onnx")

# Remove ZipMap node
nodes_to_remove = []
for i, node in enumerate(model.graph.node):
    if node.op_type == "ZipMap":
        nodes_to_remove.append(i)

# Remove nodes
for i in reversed(nodes_to_remove):
    del model.graph.node[i]

# Update output
if len(model.graph.node) > 0:
    last_node = model.graph.node[-1]
    model.graph.output[0].CopyFrom(
        helper.make_tensor_value_info(
            last_node.output[0],
            onnx.TensorProto.FLOAT,
            [None, 3]  # Adjust dims as needed
        )
    )

# Save
onnx.save(model, "burnout_model_fixed.onnx")
```

#### Option 4: Verify Model Output

Check model structure:
```python
import onnx

model = onnx.load("burnout_model.onnx")

print("Model Inputs:")
for input in model.graph.input:
    print(f"  Name: {input.name}")
    print(f"  Type: {input.type}")

print("\nModel Outputs:")
for output in model.graph.output:
    print(f"  Name: {output.name}")
    print(f"  Type: {output.type}")

print("\nModel Nodes:")
for node in model.graph.node:
    print(f"  {node.op_type}: {node.input} -> {node.output}")
```

### Expected Model Structure

Untuk aplikasi ini bekerja dengan baik, model harus:

1. **Input:**
   - Name: any string (e.g., "float_input", "input", "X")
   - Type: FLOAT tensor
   - Shape: [batch_size, 8] atau [-1, 8]

2. **Output:**
   - Name: any string (e.g., "output", "probabilities", "label")
   - Type: FLOAT tensor (PENTING!)
   - Shape: [batch_size, 3] untuk 3 classes

3. **No ZipMap or Label nodes** at the end

### Testing Model with Python

Test model sebelum digunakan di aplikasi:

```python
import onnxruntime as ort
import numpy as np

# Load model
session = ort.InferenceSession("burnout_model.onnx")

# Print info
print("Inputs:")
for inp in session.get_inputs():
    print(f"  {inp.name}: {inp.shape} ({inp.type})")

print("\nOutputs:")
for out in session.get_outputs():
    print(f"  {out.name}: {out.shape} ({out.type})")

# Test prediction
test_input = np.array([[0, 8, 6, 3, 2, 0, 7, 0.85]], dtype=np.float32)
input_name = session.get_inputs()[0].name

try:
    result = session.run(None, {input_name: test_input})
    print("\nPrediction successful!")
    print("Output:", result)
    print("Output type:", type(result[0]))
    print("Output shape:", result[0].shape if hasattr(result[0], 'shape') else 'N/A')
except Exception as e:
    print(f"\nError: {e}")
```

### Common Model Export Examples

#### From scikit-learn RandomForest:

```python
from sklearn.ensemble import RandomForestClassifier
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

# Train
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Convert
initial_type = [('float_input', FloatTensorType([None, 8]))]
onnx_model = convert_sklearn(
    model,
    initial_types=initial_type,
    target_opset=12,
    options={id(model): {'zipmap': False, 'raw_scores': True}}
)

# Save
with open("burnout_model.onnx", "wb") as f:
    f.write(onnx_model.SerializeToString())
```

#### From PyTorch:

```python
import torch
import torch.nn as nn

class BurnoutModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(8, 64)
        self.fc2 = nn.Linear(64, 32)
        self.fc3 = nn.Linear(32, 3)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)  # Raw logits, no softmax
        return x

# Export
model = BurnoutModel()
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

#### From TensorFlow/Keras:

```python
import tensorflow as tf
import tf2onnx

# Create model
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(8,)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(3)  # No activation for raw logits
])

# Train...
model.fit(X_train, y_train, epochs=50)

# Convert
spec = (tf.TensorSpec((None, 8), tf.float32, name="input"),)
model_proto, _ = tf2onnx.convert.from_keras(
    model,
    input_signature=spec,
    opset=13,
    output_path="burnout_model.onnx"
)
```

### Verifying the Fix

After re-exporting, verify:

```bash
# Install onnx
pip install onnx

# Check model
python -c "
import onnx
model = onnx.load('burnout_model.onnx')
onnx.checker.check_model(model)
print('✓ Model is valid')

# Check output type
output_type = model.graph.output[0].type.tensor_type.elem_type
print(f'Output type: {output_type}')  # Should be 1 (FLOAT)
"
```

### If You Cannot Re-export

Jika Anda tidak bisa re-export model, coba update aplikasi code untuk handle non-tensor outputs. Namun ini lebih kompleks dan mungkin tidak selalu berhasil.

### Contact for Help

Jika masih mengalami masalah:
1. Share output dari script "Verify Model Output" di atas
2. Share versi scikit-learn / PyTorch / TensorFlow yang digunakan
3. Share command yang digunakan untuk export model

### Quick Fix Checklist

- [ ] Check model output type dengan `onnx.load()`
- [ ] Pastikan tidak ada ZipMap node
- [ ] Re-export dengan `zipmap: False` option
- [ ] Test dengan Python onnxruntime dulu
- [ ] Verify output adalah Float tensor
- [ ] Verify shape adalah [batch_size, 3]
- [ ] Test dengan aplikasi

---

**Version**: 1.0.0  
**Last Updated**: 2024
