
```json
  "quiz_id_genai_020": {
    "id": "quiz_id_genai_020",
    "type": "multiple_choice",
    "topic": "Generative AI Tools Analogy",
    "subtopic": "Versatile Toolbox",
    "difficulty": 4,
    "question": "The text describes Generative AI not as one giant, do-it-all tool, but more like a 'super versatile toolbox'. What does this imply?",
    "options": [
      { "value": "A", "text": "A. Each Generative AI tool can only do one specific thing." },
      { "value": "B", "text": "B. There are many different specialized Generative AI tools, all built on similar principles." },
      { "value": "C", "text": "C. Generative AI tools are difficult to use and require many different tools." },
      { "value": "D", "text": "D. Generative AI tools are designed to replace physical toolboxes." }
    ],
    "correctAnswer": "B",
    "feedback": {
      "A": { "correct": false, "text": "The 'versatile toolbox' implies a range of abilities from common principles." },
      "B": { "correct": true, "text": "Yes! It means there are specialized tools within the generative AI realm, sharing common underlying technology." },
      "C": { "correct": false, "text": "The analogy is about variety of function from a core, not difficulty of use." },
      "D": { "correct": false, "text": "This is a metaphorical comparison, not a literal replacement." }
    },
    "tags": ["Generative AI", "Tools", "Analogy"],
    "source": {
      "module": "Introduction to GenAI",
      "lesson": "What Can It Create?"
    },
    "created_by": "Gemini-2.5-Flash",
    "version": 1
  }
```

```
{
  "id": "string",                 // Unique identifier   [Type]_[ModuleCode]-[LessonCode]_[QNumber]
  "type": "string",               // Question type: MCQ, SelectAll, FillBlank, Match, TrueFalse, etc.
  "module": "string",             // Name of the module (e.g., "LLMs Basics") OPTIONAL
  "lesson": "string",             // Name of the lesson (e.g., "Prompt Engineering") OPTIONAL
  "topic":"string",
  "subtopic":"string", 
  "difficulty": "string",         // Difficulty level: Easy, Medium, Hard
  "keywords": ["string"],         // List of key concepts covered (e.g., ["tokenization", "temperature"])
  "question_text": "string",      // The question prompt text
  "options":
  [
      { "value": "string", "text": "string" // spoilers or the right choice }
      // example { "value": "C", "text": "C. Generative AI tools are difficult to use and require many different tools." },
  ],
    "correctAnswer": "string",
    "feedback": {
      "letter": "string" : {"correct": true/false, 
      "text": "string" // explain why correct or wrong}
      //explanation "A": { "correct": false, "text": "The 'versatile toolbox' implies a range of abilities from common principles." },
      "B": { "correct": true, "text": "Yes! It means there are specialized tools within the generative AI realm, sharing common underlying technology." },
    },
    "tags": ["Generative AI", "Tools", "Analogy"], //List of Strings
    "source": {
      "module": "string",
      "lesson": "string"
    },
    "created_by": "string" // "Gemini-2.5-Flash",
    "version": numeric
  
  "answers": ["string"],          // List of correct answers (for types like SelectAll, FillBlank)
  "explanation": "string",        // General explanation shown after answering
  "author": "string",             // (Optional) Author of the question
  "created_at": "YYYY-MM-DD",     // Date of creation
  "updated_at": "YYYY-MM-DD",     // Date of last update
  "tags": ["string"],             // (Optional) Additional tags for filtering/searching
  "estimated_time_sec": 30,       // (Optional) Time to solve, in seconds
  "active": true                  // Flag to indicate if the question is active in the pool
}
```