import os
import json
import argparse
import time
from datetime import datetime
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.chains import LLMChain
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

# ----- Command-line Arguments -----
parser = argparse.ArgumentParser(description='Generate quiz questions from lesson material.')
parser.add_argument('--input', type=str, required=True, help='Path to the lesson file (.txt or .md)')
parser.add_argument('--question_type', type=str, default='multiple-choice', help='Question type: multiple-choice, FITB, SelectAll, TF, matching.')
parser.add_argument('--num_questions', type=int, default=2, help='Number of questions to generate')
parser.add_argument('--schema', type=str, default='quiz_questions_schema.md', help='Path to the JSON schema file')
parser.add_argument('--output', type=str, default=None, help='Optional output file path')
parser.add_argument('--sleep_duration', type=float, default=2.0, help='Sleep duration between API calls (seconds) for rate limiting')
parser.add_argument('--module', type=str, default=None, help='Module identifier (e.g., M1, M2) for question ID generation')
parser.add_argument('--lesson', type=str, default=None, help='Lesson identifier (e.g., L1, L2, how_ai_works) for question ID generation')
args = parser.parse_args()

lesson_file_path = args.input
question_type = args.question_type
num_questions = args.num_questions
schema_file_path = args.schema
output_path = args.output
sleep_duration = args.sleep_duration
module_id = args.module
lesson_id = args.lesson

# ----- Helper Functions -----
def generate_question_id(module_id, lesson_id, question_type, question_number):
    """Generate structured question ID in format: M1_L3_FITB_0012"""
    # Convert question type to abbreviation
    type_map = {
        'multiple-choice': 'MCQ',
        'multiple_choice': 'MCQ',
        'FITB': 'FITB',
        'fill-in-the-blank': 'FITB',
        'SelectAll': 'SA',
        'select-all': 'SA',
        'TF': 'TF',
        'true-false': 'TF',
        'matching': 'MATCH'
    }
    
    type_abbrev = type_map.get(question_type, 'MCQ')
    
    # Use provided IDs or generate defaults
    mod_id = module_id if module_id else "M1"
    les_id = lesson_id if lesson_id else "L1"
    
    # Format question number with leading zeros
    q_num = f"{question_number:04d}"
    
    return f"{mod_id}_{les_id}_{type_abbrev}_{q_num}"

# ----- Read Input Files -----
with open(lesson_file_path, "r", encoding="utf-8") as f:
    lesson_text = f.read()

with open(schema_file_path, "r", encoding="utf-8") as f:
    schema_text = f.read()

# ----- Setup LLM (Groq, Llama3 by default) -----
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable not set. Please export or set in .env.")

# Initialize Groq LLM
llm = ChatGroq(
    # model="llama3-8b-8192",  # You can change to "mixtral-8x7b-32768" etc.
    model="llama-3.1-8b-instant",
    temperature=0.4,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # other params...
)

# ----- Step 1: Generate Raw Questions -----

prompt_qs = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
            You are a quiz generator for an introductory AI course. 
            Based on the lesson material below, write {num_questions} {question_type} questions with 
            clear answer options (for MCQ, give 4 plausible choices per question).
            For each answer option, provide a short feedback comment. But do not refer to the question letter (A, B, C, D). in your feedback,
            since they will be shuffled later.
            Make sure questions are relevant to the content and test understanding of key concepts.
            To enable clear separation, end each question with a marker like '-*-*-*'
            """,),
        ("human", 
         """
            Material:
            -----
            {lesson_text}
            -----
            Format: Each question as plain text, one per line, with options labeled A, B, C, D (if applicable).
            """
        ),
    ]
)


chain = prompt_qs | llm
print("Generating raw questions from lesson text...")
questions_text = chain.invoke({
    "lesson_text": lesson_text,
    "question_type": question_type,
    "num_questions": num_questions
})

# Rate limiting: Sleep after first API call
print(f"Sleeping {sleep_duration} seconds to respect rate limits...")
time.sleep(sleep_duration)

print(questions_text.content)
print(type(questions_text.content))
# Split questions into a list (handle blank lines, numbering, etc.)
questions_list = [q.strip() for q in questions_text.content.split('-*-*-*') if q.strip()]
print(f"Received {len(questions_list)} raw questions from LLM.")

# ----- Step 2: Format Each Question as JSON -----
json_template = """ You are a JSON formatter for quiz questions. 
You will be given one question. Please produce a single JSON object following this exact schema:
{schema}

CRITICAL FORMATTING RULES:
- Return ONLY a single JSON object starting with {{ and ending with }}
- Do NOT wrap the object in an outer key/value pair
- Use "question_text" field (not "question") for the question prompt
- Use numeric values for "difficulty" (1-5) and "version" (1)
- Use "AI_AutoGen" for created_by field
- Use today's date (2024-07-09) for both created_at and updated_at
- Use the provided ID format: {question_id}
- Ensure all required fields are present and properly formatted
- All string values must be properly escaped for JSON
- Do NOT include any markdown formatting or explanations

Example of correct format:
{{
  "id": "{question_id}",
  "type": "multiple_choice",
  "question_text": "Your question here?",
  "difficulty": 3,
  "version": 1,
  "created_by": "AI_AutoGen",
  "created_at": "2024-07-09",
  "updated_at": "2024-07-09"
}}

Return only valid JSON, nothing else.
"""
user_input = """ Question: {question} """

prompt_to_get_json = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            json_template,
        ),
        ("human", user_input),
    ]
)



json_questions = []
for i, q_text in enumerate(questions_list, start=1):
    print(f"Formatting question {i}/{len(questions_list)} as JSON...")
    
    # Generate structured question ID
    question_id = generate_question_id(module_id, lesson_id, question_type, i)
    print(f"  Generated ID: {question_id}")
    
    # Rate limiting: Sleep before each JSON formatting call (except the first)
    if i > 1:
        print(f"  Sleeping {sleep_duration} seconds to respect rate limits...")
        time.sleep(sleep_duration)
    
    chain = prompt_to_get_json | llm
    json_q = chain.invoke({
        "schema": schema_text,
        "question": q_text,
        "question_id": question_id,
    })

    # Strip code block markdown if present
    result_json = json_q.content.strip()
    if result_json.startswith("```json"):
        result_json = result_json.split("```json")[1].split("```", 1)[0].strip()

    # Debug: Save raw result_json to a temp debug file for inspection
    with open("debug_llm_json_output.txt", "a", encoding="utf-8") as debug_f:
        debug_f.write(f"\n--- Question {i} ---\n{result_json}\n")
    
    # Also save more detailed debugging info
    with open("debug_parsing_log.txt", "a", encoding="utf-8") as debug_f:
        debug_f.write(f"\n=== Processing Question {i} ===\n")
        debug_f.write(f"Raw LLM output length: {len(result_json)} characters\n")
        debug_f.write(f"First 200 chars: {result_json[:200]}\n")

    import re
    
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
                import re
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
    
    # Try to extract and parse the JSON object
    json_obj = extract_json_object(result_json)
    
    # Enhanced debugging
    with open("debug_parsing_log.txt", "a", encoding="utf-8") as debug_f:
        if json_obj:
            debug_f.write(f"✓ Successfully extracted JSON object\n")
            debug_f.write(f"Object keys: {list(json_obj.keys())}\n")
        else:
            debug_f.write(f"✗ Failed to extract JSON object\n")
    
    if json_obj:
        normalized_obj = normalize_json_object(json_obj)
        if normalized_obj:
            json_questions.append(normalized_obj)
            print(f"✓ Successfully processed question {i}")
            with open("debug_parsing_log.txt", "a", encoding="utf-8") as debug_f:
                debug_f.write(f"✓ Successfully normalized and added to results\n")
        else:
            print(f"✗ Warning: Could not normalize question {i} (missing required fields)")
            with open("debug_parsing_log.txt", "a", encoding="utf-8") as debug_f:
                debug_f.write(f"✗ Normalization failed - missing required fields\n")
            continue
    else:
        print(f"✗ Warning: Could not parse LLM output for question {i}")
        print("Output was:\n", result_json[:400])
        with open("debug_parsing_log.txt", "a", encoding="utf-8") as debug_f:
            debug_f.write(f"✗ JSON extraction failed\n")
        continue

# ----- Save to Output File -----
if not output_path:
    # Auto-generate based on lesson, type, and date
    lesson_label = os.path.splitext(os.path.basename(lesson_file_path))[0]
    output_dir = "output"
    os.makedirs(output_dir, exist_ok=True)
    outtype = question_type.replace(" ", "_")
    output_path = f"{output_dir}/{lesson_label}_{outtype}_{datetime.today().strftime('%Y%m%d')}.json"

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(json_questions, f, indent=2)

print(f"\n" + "="*50)
print(f"PROCESSING SUMMARY")
print(f"="*50)
print(f"Total questions processed: {len(questions_list)}")
print(f"Successfully saved: {len(json_questions)}")
print(f"Failed to process: {len(questions_list) - len(json_questions)}")
print(f"Rate limiting: {sleep_duration}s sleep between API calls")
print(f"Total API calls made: {len(questions_list) + 1}")
print(f"Output file: {output_path}")
print(f"Debug files: debug_llm_json_output.txt, debug_parsing_log.txt")
print(f"="*50)
