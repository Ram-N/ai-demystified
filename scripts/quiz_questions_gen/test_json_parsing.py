#!/usr/bin/env python3
"""
Test script to verify the JSON parsing fixes work with existing debug output
"""
import json
import re
from datetime import datetime

def extract_json_object(text):
    """Extract a complete JSON object from text, handling both wrapped and unwrapped formats."""
    # Try to find JSON object boundaries more accurately
    brace_count = 0
    start_pos = -1
    in_string = False
    escape_next = False
    
    for i, char in enumerate(text):
        if escape_next:
            escape_next = False
            continue
            
        if char == '\\':
            escape_next = True
            continue
            
        if char == '"' and not escape_next:
            in_string = not in_string
            continue
            
        if not in_string:
            if char == '{':
                if start_pos == -1:
                    start_pos = i
                brace_count += 1
            elif char == '}':
                brace_count -= 1
                if brace_count == 0 and start_pos != -1:
                    # Found complete JSON object
                    json_str = text[start_pos:i+1]
                    try:
                        parsed = json.loads(json_str)
                        
                        # Check if it's wrapped (has a key that contains the actual object)
                        if len(parsed) == 1 and isinstance(list(parsed.values())[0], dict):
                            # It's wrapped - extract the inner object
                            return list(parsed.values())[0]
                        else:
                            # It's unwrapped - use as is
                            return parsed
                    except json.JSONDecodeError:
                        continue
    return None

def normalize_json_object(obj):
    """Normalize and validate a JSON object to ensure consistency."""
    # Ensure question_text field (some might use "question")
    if "question" in obj and "question_text" not in obj:
        obj["question_text"] = obj["question"]
        del obj["question"]
    
    # Ensure difficulty is numeric
    if "difficulty" in obj:
        if isinstance(obj["difficulty"], str):
            # Try to convert string difficulty to number
            difficulty_map = {"easy": 1, "medium": 3, "hard": 5}
            obj["difficulty"] = difficulty_map.get(obj["difficulty"].lower(), 3)
        elif not isinstance(obj["difficulty"], (int, float)):
            obj["difficulty"] = 3  # Default to medium
    
    # Ensure version is numeric
    if "version" in obj:
        if isinstance(obj["version"], str):
            # Extract number from string like "v1"
            match = re.search(r'\d+', str(obj["version"]))
            obj["version"] = int(match.group()) if match else 1
        elif not isinstance(obj["version"], (int, float)):
            obj["version"] = 1
    
    # Ensure created_by is set
    if "created_by" not in obj:
        obj["created_by"] = "AI_AutoGen"
    
    # Ensure dates are set
    today = datetime.today().strftime('%Y-%m-%d')
    if "created_at" not in obj:
        obj["created_at"] = today
    if "updated_at" not in obj:
        obj["updated_at"] = today
    
    # Ensure required fields exist
    required_fields = ["id", "type", "question_text", "options", "correctAnswer", "feedback"]
    for field in required_fields:
        if field not in obj:
            print(f"Warning: Missing required field '{field}' in question")
            return None
    
    return obj

def test_parsing():
    """Test our parsing logic with the existing debug output."""
    try:
        with open("debug_llm_json_output.txt", "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print("No debug_llm_json_output.txt found. Run the main script first.")
        return
    
    # Split by question markers
    questions = content.split("--- Question ")[1:]  # Skip empty first element
    
    print(f"Found {len(questions)} questions in debug output")
    print("="*60)
    
    successful_parses = 0
    
    for i, q in enumerate(questions, 1):
        print(f"\nTesting Question {i}:")
        
        # Extract the JSON part (everything after the header line)
        lines = q.split('\n', 1)
        if len(lines) < 2:
            print(f"  ✗ No JSON content found")
            continue
        
        json_content = lines[1].strip()
        
        # Try to parse with our improved logic
        json_obj = extract_json_object(json_content)
        
        if json_obj:
            print(f"  ✓ Successfully extracted JSON")
            print(f"    Keys: {list(json_obj.keys())}")
            
            # Try to normalize
            normalized = normalize_json_object(json_obj.copy())  # Copy to avoid modifying original
            if normalized:
                print(f"  ✓ Successfully normalized")
                successful_parses += 1
                
                # Check for consistency issues
                issues = []
                if "question" in json_obj and "question_text" in json_obj:
                    issues.append("Both 'question' and 'question_text' fields present")
                if "difficulty" in json_obj and isinstance(json_obj["difficulty"], str):
                    issues.append(f"String difficulty: '{json_obj['difficulty']}' -> {normalized['difficulty']}")
                if "version" in json_obj and isinstance(json_obj["version"], str):
                    issues.append(f"String version: '{json_obj['version']}' -> {normalized['version']}")
                
                if issues:
                    print(f"    Fixed issues: {', '.join(issues)}")
                    
            else:
                print(f"  ✗ Failed to normalize (missing required fields)")
        else:
            print(f"  ✗ Failed to extract JSON")
            print(f"    First 100 chars: {json_content[:100]}")
    
    print(f"\n{'='*60}")
    print(f"SUMMARY: {successful_parses}/{len(questions)} questions successfully parsed")
    print(f"Success rate: {successful_parses/len(questions)*100:.1f}%")

if __name__ == "__main__":
    test_parsing()