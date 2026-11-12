#!/usr/bin/env python3
"""
Script to fix ONNX model with non-tensor outputs
This script removes ZipMap nodes and ensures tensor outputs
"""

import sys
import onnx
from onnx import helper, numpy_helper

def fix_onnx_model(input_path, output_path):
    """Fix ONNX model by removing non-tensor outputs"""
    
    print(f"Loading model from: {input_path}")
    model = onnx.load(input_path)
    
    print("\n=== Original Model Info ===")
    print(f"IR Version: {model.ir_version}")
    print(f"Opset: {model.opset_import[0].version}")
    
    print("\nInputs:")
    for inp in model.graph.input:
        print(f"  - {inp.name}: {inp.type}")
    
    print("\nOutputs:")
    for out in model.graph.output:
        print(f"  - {out.name}: {out.type}")
    
    print("\nNodes:")
    for i, node in enumerate(model.graph.node):
        print(f"  {i}: {node.op_type} ({node.input} -> {node.output})")
    
    # Find and remove ZipMap nodes
    nodes_to_remove = []
    zipmap_outputs = []
    
    for i, node in enumerate(model.graph.node):
        if node.op_type == "ZipMap":
            print(f"\n⚠️  Found ZipMap node at index {i}")
            nodes_to_remove.append(i)
            zipmap_outputs.extend(node.output)
    
    if nodes_to_remove:
        print(f"\n🔧 Removing {len(nodes_to_remove)} ZipMap node(s)...")
        
        # Remove ZipMap nodes
        for i in reversed(nodes_to_remove):
            del model.graph.node[i]
        
        # Find the node before ZipMap (usually the classifier)
        classifier_node = None
        for node in model.graph.node:
            if any(out in zipmap_outputs or 'probabilities' in out or 'output' in out 
                   for out in node.output):
                continue
            if node.op_type in ['TreeEnsembleClassifier', 'LinearClassifier', 
                               'SVMClassifier', 'ZipMap']:
                continue
            # Look for the actual prediction node
            if 'label' not in node.output[0].lower():
                classifier_node = node
        
        # Find probability output
        prob_output = None
        for node in model.graph.node:
            for out in node.output:
                if 'probabilities' in out.lower() or 'probability' in out.lower():
                    prob_output = out
                    break
            if prob_output:
                break
        
        if prob_output:
            print(f"✓ Found probability output: {prob_output}")
            
            # Update model output to use probabilities
            model.graph.output[0].CopyFrom(
                helper.make_tensor_value_info(
                    prob_output,
                    onnx.TensorProto.FLOAT,
                    [None, 3]  # batch_size, num_classes
                )
            )
        else:
            print("⚠️  Could not find probability output, keeping first node output")
            if len(model.graph.node) > 0:
                last_node = model.graph.node[-1]
                model.graph.output[0].CopyFrom(
                    helper.make_tensor_value_info(
                        last_node.output[0],
                        onnx.TensorProto.FLOAT,
                        [None, 3]
                    )
                )
    else:
        print("\n✓ No ZipMap nodes found")
    
    # Clean up outputs - keep only the probability tensor
    while len(model.graph.output) > 1:
        model.graph.output.pop()
    
    # Verify output is tensor type
    print("\n=== Fixed Model Info ===")
    print("Outputs:")
    for out in model.graph.output:
        elem_type = out.type.tensor_type.elem_type
        type_name = "FLOAT" if elem_type == 1 else f"Type {elem_type}"
        print(f"  - {out.name}: {type_name} tensor")
        if out.type.tensor_type.shape.dim:
            dims = [d.dim_value if d.dim_value > 0 else 'None' 
                   for d in out.type.tensor_type.shape.dim]
            print(f"    Shape: {dims}")
    
    # Check model
    try:
        onnx.checker.check_model(model)
        print("\n✓ Model is valid")
    except Exception as e:
        print(f"\n⚠️  Model validation warning: {e}")
    
    # Save fixed model
    print(f"\n💾 Saving fixed model to: {output_path}")
    onnx.save(model, output_path)
    
    print("\n✅ Model fixed successfully!")
    print(f"\nNext steps:")
    print(f"1. Test with: python test_onnx_model.py {output_path}")
    print(f"2. Replace your model file with the fixed version")
    
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fix_onnx_model.py <input_model.onnx> [output_model.onnx]")
        print("\nExample:")
        print("  python fix_onnx_model.py burnout_model.onnx burnout_model_fixed.onnx")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2] if len(sys.argv) > 2 else input_path.replace('.onnx', '_fixed.onnx')
    
    try:
        fix_onnx_model(input_path, output_path)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
