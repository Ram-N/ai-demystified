# Quiz Question Generator: `questions_from_lessons.py`

This tool generates high-quality quiz questions (MCQ, Fill-in-the-Blank, Select All, etc.) from your lesson material using free/open-source LLMs via API (such as Groq's Llama-3). Questions are auto-formatted into your custom JSON schema, ready to use in any educational or quiz app.

---

## Features

* **Flexible input:** Works with any `.md` or `.txt` lesson file.
* **Multiple question types:** Supports MCQ, FITB, SelectAll, TF, matching—just specify in the command.
* **Structured Question IDs:** Generates organized IDs like `M1_L3_FITB_0012` (Module_Lesson_Type_Number).
* **Robust JSON parsing:** Handles escaped quotes, mixed formats, and validates output.
* **Rate limiting:** Built-in delays to respect API limits for free tier users.
* **Enhanced error handling:** Detailed debugging and progress tracking.
* **Field normalization:** Automatically standardizes question formats and data types.
* **Fully auto-formatted:** Outputs standards-compliant JSON (your schema).
* **Command-line operation:** Specify all key parameters on the fly.
* **Free/open LLMs:** Uses Groq (or any LangChain-supported provider).

---

## Installation

1. **Clone the repo (or copy the script and schema):**

   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   *(If you don't have a `requirements.txt`, use: `pip install langchain langchain-community openai groq python-dotenv langchain-groq`)*

3. **Set up your Groq API key:**

   * [Sign up for Groq API](https://console.groq.com/keys) if you don't have one.
   * Add to your environment:

     ```bash
     export GROQ_API_KEY=your-groq-api-key
     ```

     Or place in a `.env` file in the project root:

     ```
     GROQ_API_KEY=your-groq-api-key
     ```

4. **Prepare your lesson files:**

   * Put lesson content as `.txt` or `.md` in any folder.
   * Ensure your `quiz_questions_schema.md` (schema) is in the project directory.

---

## Usage

### Basic Command

```bash
python questions_from_lessons.py --input path/to/lesson.md
```

### Command Line Options

| Option | Description | Default | Example |
|--------|-------------|---------|---------|
| `--input` | Path to lesson file (.txt or .md) | **Required** | `lessons/module2.md` |
| `--question_type` | Type of questions to generate | `multiple-choice` | `FITB`, `SelectAll`, `TF`, `matching` |
| `--num_questions` | Number of questions to generate | `2` | `5` |
| `--module` | Module identifier for question IDs | `M1` | `M2`, `intro` |
| `--lesson` | Lesson identifier for question IDs | `L1` | `L3`, `how_ai_works` |
| `--schema` | Path to JSON schema file | `quiz_questions_schema.md` | `custom_schema.md` |
| `--output` | Output file path | Auto-generated | `my_quiz.json` |
| `--sleep_duration` | Delay between API calls (seconds) | `2.0` | `1.5`, `3.0` |

### Examples

**Basic usage with structured IDs:**
```bash
python questions_from_lessons.py --input lessons/module2_lesson3.md --module M2 --lesson L3 --question_type FITB --num_questions 5
```
*Generates IDs: `M2_L3_FITB_0001`, `M2_L3_FITB_0002`, etc.*

**With lesson name instead of number:**
```bash
python questions_from_lessons.py --input lessons/deep_learning.md --module M1 --lesson deep_models --question_type multiple-choice --num_questions 3
```
*Generates IDs: `M1_deep_models_MCQ_0001`, `M1_deep_models_MCQ_0002`, etc.*

**Conservative rate limiting for free tier:**
```bash
python questions_from_lessons.py --input lesson.md --sleep_duration 3.0 --num_questions 10
```

**Different question types:**
```bash
# Multiple choice questions
python questions_from_lessons.py --input lesson.md --question_type multiple-choice

# Fill in the blank
python questions_from_lessons.py --input lesson.md --question_type FITB

# Select all that apply
python questions_from_lessons.py --input lesson.md --question_type SelectAll

# True/False questions
python questions_from_lessons.py --input lesson.md --question_type TF
```

---

## Question ID Format

The script generates structured question IDs in the format: `{MODULE}_{LESSON}_{TYPE}_{NUMBER}`

### Question Type Abbreviations
- `multiple-choice` → `MCQ`
- `FITB` → `FITB`
- `SelectAll` → `SA`
- `TF` → `TF`
- `matching` → `MATCH`

### Examples
- `M1_L3_FITB_0012` - Module 1, Lesson 3, Fill-in-the-Blank, Question 12
- `M2_how_ai_works_MCQ_0001` - Module 2, "how_ai_works" lesson, Multiple Choice, Question 1

---

## Output

### File Structure
* JSON file saved to `output/` directory (default)
* Filename format: `{lesson}_{question_type}_{YYYYMMDD}.json`
* Each question is a valid JSON object following your custom schema

### Debug Files
* `debug_llm_json_output.txt` - Raw LLM responses for troubleshooting
* `debug_parsing_log.txt` - Detailed parsing process and error information

### Processing Summary
The script provides a detailed summary showing:
- Total questions processed
- Successfully saved questions
- Failed questions (with reasons)
- Rate limiting settings
- Total API calls made
- Output file locations

---

## Enhanced Features

### 🔧 Robust JSON Parsing
- **Handles escaped quotes** in question text (e.g., `\"latent spaces\"`)
- **Supports mixed formats** from LLM (wrapped/unwrapped JSON objects)
- **Validates required fields** and provides clear error messages
- **Normalizes data types** (converts string difficulty to numbers, etc.)

### ⏱️ Rate Limiting
- **Configurable delays** between API calls to respect free tier limits
- **Progress tracking** with sleep notifications
- **Optimized for Groq free tier** (2-second default delays)

### 🛠️ Field Normalization
- **Standardizes field names** (`question` → `question_text`)
- **Converts data types** (string difficulty → numeric, version strings → numbers)
- **Fills missing fields** with sensible defaults
- **Ensures consistency** across all generated questions

### 🔍 Enhanced Error Handling
- **Detailed debugging output** with multiple log files
- **Continues processing** even if individual questions fail
- **Clear error messages** for troubleshooting
- **Success/failure tracking** for each question

---

## Models Used

By default, this script uses **Groq's Llama-3.1-8B-Instant** via LangChain, but you can switch to other supported models with small code changes. Everything runs via API—no GPU needed.

**Supported Models:**
- `llama-3.1-8b-instant` (default)
- `llama3-8b-8192`
- `mixtral-8x7b-32768`

---

## Troubleshooting

### Common Issues

**API Key Error:**
```
RuntimeError: GROQ_API_KEY environment variable not set
```
*Solution: Make sure `GROQ_API_KEY` is set in your environment or `.env` file.*

**Rate Limiting:**
```
✗ Warning: Could not parse LLM output for question X
```
*Solution: Increase `--sleep_duration` to 3.0 or higher for free tier.*

**JSON Parsing Errors:**
```
Warning: Missing required field 'question_text' in question
```
*Solution: Check `debug_llm_json_output.txt` for malformed responses. The script auto-normalizes most issues.*

**Slow Performance:**
*Solution: Free APIs sometimes rate-limit; the script includes automatic delays and retry logic.*

### Debug Files
Check these files for detailed troubleshooting:
- `debug_llm_json_output.txt` - Raw LLM responses
- `debug_parsing_log.txt` - Detailed parsing process

---

## Testing

### Test Scripts Included

**`test_json_parsing.py`** - Test the JSON parsing logic:
```bash
python test_json_parsing.py
```

**`test_output_validation.py`** - Validate final JSON output:
```bash
python test_output_validation.py
```

Both scripts work with existing debug data and provide detailed success/failure reports.

---

## Customization

### Other LLM Providers
You can swap Groq for HuggingFace, Ollama, etc. by updating the LLM setup in the script:

```python
# Replace the ChatGroq initialization with your preferred provider
llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.4)
```

### Schema Changes
Edit `quiz_questions_schema.md` to match your application's requirements. The script will automatically format questions according to your schema.

### Prompt Tuning
Adjust the prompt templates in the script:
- `prompt_qs` - Controls initial question generation
- `json_template` - Controls JSON formatting and structure

### Question ID Customization
Modify the `generate_question_id()` function to change ID format or add new question types.

---

## Recent Updates

### Version 2.0 Features
- ✅ **Structured Question IDs** - Organized format like `M1_L3_FITB_0012`
- ✅ **Enhanced JSON Parsing** - Handles escaped quotes and mixed formats
- ✅ **Rate Limiting** - Built-in delays for free tier API usage
- ✅ **Field Normalization** - Automatic data type conversion and validation
- ✅ **Better Error Handling** - Detailed debugging and progress tracking
- ✅ **Test Suite** - Validation scripts for quality assurance

### Breaking Changes
- Question IDs now use structured format instead of random numbers
- New command line arguments: `--module`, `--lesson`, `--sleep_duration`
- Enhanced JSON validation may reject previously accepted malformed questions

---

## License

MIT (or specify your license here).

---

## Credits

Developed by Ram with Claude Code assistance.
Uses [LangChain](https://python.langchain.com/), [Groq API](https://console.groq.com/), and open-source LLMs.

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes with the included test scripts
4. Submit a pull request with detailed description

For bug reports or feature requests, please create an issue with:
- Command used
- Input file sample
- Debug file contents (`debug_llm_json_output.txt`)
- Expected vs actual behavior