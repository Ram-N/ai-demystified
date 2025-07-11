#!/usr/bin/env python3
"""
Test script to create a sample JSON output from existing debug data
"""
import json
from test_json_parsing import extract_json_object, normalize_json_object

def create_sample_output():
    """Create a sample JSON output file from the debug data."""
    try:
        with open("debug_llm_json_output.txt", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("No debug_llm_json_output.txt found. Run the main script first.")
        return
    
    # Split by question markers
    questions = content.split("--- Question ")[1:]  # Skip empty first element
    
    json_questions = []
    
    for i, q in enumerate(questions, 1):
        # Extract the JSON part (everything after the header line)
        lines = q.split('\n', 1)
        if len(lines) < 2:
            continue
        
        json_content = lines[1].strip()
        
        # Parse with our improved logic
        json_obj = extract_json_object(json_content)
        
        if json_obj:
            normalized = normalize_json_object(json_obj.copy())
            if normalized:
                json_questions.append(normalized)
    
    # Save to a test output file
    output_path = "test_output_sample.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(json_questions, f, indent=2)
    
    print(f"Created sample output: {output_path}")
    print(f"Successfully processed {len(json_questions)} questions")
    
    # Validate the JSON
    try:
        with open(output_path, "r", encoding="utf-8") as f:
            loaded = json.load(f)
        print(f"✓ JSON validation passed - file contains {len(loaded)} questions")
        
        # Check first question structure
        if loaded:
            print(f"✓ First question has fields: {list(loaded[0].keys())}")
            
    except json.JSONDecodeError as e:
        print(f"✗ JSON validation failed: {e}")

if __name__ == "__main__":
    create_sample_output()