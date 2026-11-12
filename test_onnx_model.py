#!/usr/bin/env python3
"""
Test ONNX model to verify it works correctly
"""

import sys
import numpy as np
import onnxruntime as ort

def test_model(model_path):
    """Test ONNX model with sample input"""
    
    print(f"Loading model: {model_path}")
    session = ort.InferenceSession(model_path)
    
    print("\n=== Model Information ===")
    print(f"Providers: {session.get_providers()}")
    
    print("\nInputs:")
    for inp in session.get_inputs():
        print(f"  - Name: {inp.name}")
        print(f"    Shape: {inp.shape}")
        print(f"    Type: {inp.type}")
    
    print("\nOutputs:")
    for out in session.get_outputs():
        print(f"  - Name: {out.name}")
        print(f"    Shape: {out.shape}")
        print(f"    Type: {out.type}")
    
    # Test predictions
    print("\n=== Testing Predictions ===")
    
    test_cases = [
        {
            "name": "Low Risk Employee",
            "data": [0, 8, 6, 3, 2, 0, 7, 0.85]
        },
        {
            "name": "Medium Risk Employee",
            "data": [0, 9, 8, 4, 2, 1, 6.5, 0.80]
        },
        {
            "name": "High Risk Employee",
            "data": [0, 12, 11, 7, 0, 1, 5, 0.65]
        }
    ]
    
    input_name = session.get_inputs()[0].name
    
    for i, test in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test['name']}")
        print(f"Input: {test['data']}")
        
        # Prepare input
        input_data = np.array([test['data']], dtype=np.float32)
        
        try:
            # Run prediction
            result = session.run(None, {input_name: input_data})
            
            print(f"✓ Prediction successful!")
            print(f"  Raw output: {result}")
            print(f"  Output shape: {result[0].shape}")
            print(f"  Output type: {type(result[0])}")
            
            # Parse result
            if len(result[0][0]) >= 3:
                # Probabilities/logits for 3 classes
                probs = result[0][0]
                predicted_class = np.argmax(probs)
                class_names = ["Low", "Medium", "High"]
                
                # Apply softmax if values seem like logits
                if np.max(probs) > 2 or np.min(probs) < -2:
                    exp_probs = np.exp(probs - np.max(probs))
                    probs = exp_probs / np.sum(exp_probs)
                
                print(f"  Predicted class: {class_names[predicted_class]}")
                print(f"  Probabilities: Low={probs[0]:.3f}, Medium={probs[1]:.3f}, High={probs[2]:.3f}")
            else:
                print(f"  Result: {result[0][0]}")
            
        except Exception as e:
            print(f"✗ Prediction failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    print("\n" + "="*50)
    print("✅ All tests passed!")
    print("\nModel is ready to use in the application.")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python test_onnx_model.py <model.onnx>")
        print("\nExample:")
        print("  python test_onnx_model.py burnout_model.onnx")
        sys.exit(1)
    
    model_path = sys.argv[1]
    
    try:
        success = test_model(model_path)
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
