// infinite_quiz.js

let quizData = {};
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5; // default quiz length
let hasSubmitted = {}; // tracks whether answer has been submitted for scoring

const baseurl = window.BASEURL || '/ai-demystified';
const quizManifestUrl = `${baseurl}/assets/data/quiz_manifest.json`;
const modulesUrl = `${baseurl}/modules.json`;
const lessonsUrl = `${baseurl}/lessons.json`;

// DOM elements
const quizSetup = document.getElementById('quiz-setup');
const quizContent = document.querySelector('.quiz-content');
const quizTitle = document.querySelector('.quiz-title');
const titleText = document.querySelector('.title-text');
const toggleIcon = document.querySelector('.toggle-icon');
const topicSelect = document.getElementById('topicSelect');
const moduleSelect = document.getElementById('moduleSelect');
const lessonSelect = document.getElementById('lessonSelect');
const moduleSection = document.getElementById('moduleSection');
const difficultyMinInput = document.getElementById('difficultyMin');
const difficultyMaxInput = document.getElementById('difficultyMax');
const diffEasyBtn = document.getElementById('diffEasy');
const diffMediumBtn = document.getElementById('diffMedium');
const diffHardBtn = document.getElementById('diffHard');
const startQuizBtn = document.getElementById('startQuiz');
const quizContainer = document.getElementById('quiz-section');
const progressDisplay = document.getElementById('quiz-progress');
const scoreDisplay = document.getElementById('quiz-score');

// Load modules and lessons
fetch(modulesUrl).then(res => res.json()).then(data => {
  data.forEach(mod => {
    const opt = document.createElement('option');
    opt.value = mod.slug;
    opt.textContent = mod.title;
    moduleSelect.appendChild(opt);
  });
});

// Handle topic selection change
if (topicSelect) {
  topicSelect.addEventListener('change', function() {
    if (this.value === 'topic-quiz') {
      moduleSection.style.display = 'block';
    } else {
      moduleSection.style.display = 'none';
    }
    resetQuizState();
  });
  
  // Initialize on page load
  moduleSection.style.display = topicSelect.value === 'topic-quiz' ? 'block' : 'none';
}

fetch(lessonsUrl).then(res => res.json()).then(data => {
  data.forEach(lesson => {
    const opt = document.createElement('option');
    opt.value = lesson.topic_slug;
    opt.textContent = lesson.title;
    lessonSelect.appendChild(opt);
  });
});

// Add change listeners to module and lesson selects to reset quiz state
if (moduleSelect) {
  moduleSelect.addEventListener('change', resetQuizState);
}

if (lessonSelect) {
  lessonSelect.addEventListener('change', resetQuizState);
}

// Load quiz data from all files listed in the manifest
fetch(quizManifestUrl)
  .then(res => res.json())
  .then(fileList => {
    return Promise.all(
      fileList.map(filename =>
        fetch(`${baseurl}/assets/data/${filename}`)
          .then(res => res.json())
          .catch(err => {
            console.error("Error loading quiz data from", filename, err);
            return {};
          })
      )
    );
  })
  .then(allData => {
    quizData = allData.flatMap((data, fileIndex) => {
      const questions = Array.isArray(data) ? data : Object.values(data);
      console.log("Processing quiz file", fileIndex, "with", questions.length, "questions");
      
      // Validate and make IDs unique by adding file prefix
      questions.forEach((q, qIndex) => {
        if (!q.id || !q.type || !q.question_text) {
          console.warn("Invalid question schema:", q);
        }
        
        // Make ID unique by prefixing with file index
        const originalId = q.id;
        q.id = `file${fileIndex}_${q.id}`;
        
        if (originalId !== q.id) {
          console.log("Made ID unique:", originalId, "→", q.id);
        }
      });
      
      return questions;
    });
    console.log("Combined quiz data loaded:", quizData.length, "total questions");
    console.log("Sample question structure:", quizData[0]);
  })
  .catch(err => {
    console.error("Error loading quiz manifest or quiz data:", err, "URL was:", quizManifestUrl);
  });

// Function to reset quiz state
function resetQuizState() {
  quizContainer.innerHTML = '';
  progressDisplay.textContent = 'Not started';
  scoreDisplay.textContent = 'Score: 0 / 0';
  currentQuestionIndex = 0;
  score = 0;
  currentQuiz = [];
  hasSubmitted = {};
}

// Handle difficulty button clicks
if (diffEasyBtn) {
  diffEasyBtn.addEventListener('click', function() {
    setActiveDifficultyButton(this);
    difficultyMinInput.value = this.dataset.min;
    difficultyMaxInput.value = this.dataset.max;
    resetQuizState();
  });
}

if (diffMediumBtn) {
  diffMediumBtn.addEventListener('click', function() {
    setActiveDifficultyButton(this);
    difficultyMinInput.value = this.dataset.min;
    difficultyMaxInput.value = this.dataset.max;
    resetQuizState();
  });
}

if (diffHardBtn) {
  diffHardBtn.addEventListener('click', function() {
    setActiveDifficultyButton(this);
    difficultyMinInput.value = this.dataset.min;
    difficultyMaxInput.value = this.dataset.max;
    resetQuizState();
  });
}

function setActiveDifficultyButton(activeBtn) {
  // Remove active class from all buttons
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to clicked button
  activeBtn.classList.add('active');
}

// Toggle quiz setup collapse
quizTitle.addEventListener('click', () => {
  const isCollapsed = quizSetup.classList.contains('collapsed');
  
  if (isCollapsed) {
    // Expand
    quizSetup.classList.remove('collapsed');
    quizTitle.classList.remove('collapsed');
    quizContent.classList.remove('collapsed');
    titleText.textContent = 'Test Your Knowledge';
  } else {
    // Collapse
    quizSetup.classList.add('collapsed');
    quizTitle.classList.add('collapsed');
    quizContent.classList.add('collapsed');
    updateCollapsedTitle();
  }
});

// Update the title when collapsed based on selected options
function updateCollapsedTitle() {
  let quizTypeText = 'Quiz';
  
  // If topic-specific
  if (topicSelect && topicSelect.value === 'topic-quiz') {
    if (moduleSelect.value) {
      const selectedModule = moduleSelect.options[moduleSelect.selectedIndex].text;
      quizTypeText = selectedModule;
      
      if (lessonSelect.value) {
        const selectedLesson = lessonSelect.options[lessonSelect.selectedIndex].text;
        quizTypeText = `${selectedModule}: ${selectedLesson}`;
      }
    }
  }
  
  // Add difficulty
  let difficultyText = 'Medium';
  if (diffEasyBtn.classList.contains('active')) {
    difficultyText = 'Easy';
  } else if (diffHardBtn.classList.contains('active')) {
    difficultyText = 'Advanced';
  }
  
  titleText.textContent = `${quizTypeText} (${difficultyText})`;
}

startQuizBtn.addEventListener('click', () => {
  const minDiff = parseInt(difficultyMinInput.value);
  const maxDiff = parseInt(difficultyMaxInput.value);
  const topicValue = topicSelect ? topicSelect.value : '';
  const moduleSlug = topicValue === 'topic-quiz' ? moduleSelect.value : '';
  const lessonSlug = topicValue === 'topic-quiz' ? lessonSelect.value : '';
  
  // Collapse the quiz setup when starting
  quizSetup.classList.add('collapsed');
  quizTitle.classList.add('collapsed');
  quizContent.classList.add('collapsed');
  updateCollapsedTitle();

  // If no quiz data is loaded yet, show a message and return
  if (!quizData || quizData.length === 0) {
    alert("Quiz data is not loaded yet. Please try again in a moment.");
    return;
  }
  
  // Filter questions
  console.log("Filtering questions with:", { minDiff, maxDiff, moduleSlug, lessonSlug });
  console.log("Available quiz data:", quizData);
  
  currentQuiz = quizData.filter(q => {
    // Filter out inactive questions
    if (q.active === false) {
      console.log("Skipping inactive question:", q.id);
      return false;
    }
    
    // Map question type to internal format
    const mappedType = mapQuestionType(q.type);
    
    // ONLY include multiple_choice questions and exclude multiple_select for now
    if (mappedType !== 'multiple_choice') {
      return false;
    }
    
    // Ensure it has options array for rendering
    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
      console.warn("Question missing options array:", q.id);
      return false;
    }
    
    // Convert difficulty to numeric and check range
    const numericDifficulty = getDifficultyNumeric(q.difficulty);
    const diffMatch = numericDifficulty >= minDiff && numericDifficulty <= maxDiff;
    
    // For module matching, first try direct match, if not, try to convert format
    let modMatch = true;
    if (moduleSlug) {
      // Try different matching approaches for module
      const directMatch = q.source?.module?.toLowerCase().replace(/\s+/g, '-') === moduleSlug;
      const fuzzyMatch = moduleSlug.includes(q.source?.module?.toLowerCase().replace(/\s+/g, '-')) || 
                        (q.source?.module?.toLowerCase().replace(/\s+/g, '-')).includes(moduleSlug);
      modMatch = directMatch || fuzzyMatch;
    }
    
    // For lesson matching, similar approach as module
    let lessonMatch = true;
    if (lessonSlug) {
      // Try different matching approaches for lesson
      const directMatch = q.source?.lesson?.toLowerCase().replace(/\s+/g, '_') === lessonSlug;
      const fuzzyMatch = lessonSlug.includes(q.source?.lesson?.toLowerCase().replace(/\s+/g, '_')) || 
                        (q.source?.lesson?.toLowerCase().replace(/\s+/g, '_')).includes(lessonSlug);
      lessonMatch = directMatch || fuzzyMatch;
    }
    
    // Enhanced keyword/tag matching
    let keywordMatch = true;
    const searchTerms = [moduleSlug, lessonSlug].filter(Boolean);
    
    if (searchTerms.length > 0) {
      // Check keywords array
      const keywordMatches = q.keywords?.some(keyword => 
        searchTerms.some(term => 
          keyword.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(keyword.toLowerCase())
        )
      );
      
      // Check tags array  
      const tagMatches = q.tags?.some(tag =>
        searchTerms.some(term =>
          tag.toLowerCase().includes(term.toLowerCase()) ||
          term.toLowerCase().includes(tag.toLowerCase())
        )
      );
      
      // Enhanced match if we have keyword/tag matches
      if (keywordMatches || tagMatches) {
        keywordMatch = true;
      }
    }
    
    console.log("Question filtering:", {
      id: q.id,
      type: q.type,
      mappedType: mappedType,
      difficulty: q.difficulty,
      numericDifficulty: numericDifficulty,
      diffMatch,
      active: q.active,
      module: q.source?.module,
      modMatch,
      lesson: q.source?.lesson,
      lessonMatch,
      keywords: q.keywords,
      tags: q.tags,
      keywordMatch
    });
    
    return diffMatch && (moduleSlug ? modMatch : true) && (lessonSlug ? lessonMatch : true);
  });

  console.log("Filtered quiz data:", currentQuiz);
  
  // Check if we have questions after filtering
  if (currentQuiz.length === 0) {
    quizContainer.innerHTML = '<p>No questions match your criteria. Try adjusting your filters.</p>';
    return;
  }
  
  // Limit to totalQuestions and shuffle
  currentQuiz = shuffle(currentQuiz).slice(0, totalQuestions);
  currentQuestionIndex = 0;
  score = 0;
  hasSubmitted = {};
  renderQuestion();
  updateProgress();
});

function renderQuestion() {
  quizContainer.innerHTML = '';
  const q = currentQuiz[currentQuestionIndex];
  if (!q) {
    console.error("No question found at index:", currentQuestionIndex);
    return;
  }
  
  console.log("Rendering question:", q.id, "Index:", currentQuestionIndex, "Already submitted:", hasSubmitted[q.id]);
  
  // Validate question structure
  if (!q.question_text && !q.question) {
    console.error("Question missing question_text field:", q);
    quizContainer.innerHTML = '<p>Error: Question text is missing</p>';
    return;
  }
  
  if (!q.options || !Array.isArray(q.options)) {
    console.error("Question missing valid options array:", q);
    quizContainer.innerHTML = '<p>Error: Question options are missing</p>';
    return;
  }

  // Update progress counter as soon as question is displayed
  updateProgress();

  const form = document.createElement('form');
  form.id = q.id;
  form.className = 'quiz-form';

  const questionP = document.createElement('p');
  questionP.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${q.question_text || q.question}`;
  form.appendChild(questionP);

  // Track if any option is selected
  
  // We only deal with multiple choice questions now
  q.options.forEach(option => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio'; // Always radio buttons for single-answer MCQs
    input.name = q.id;
    input.value = option.value;
    input.addEventListener('change', () => {
      handleOptionChange(q, form, input);
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${option.text}`));
    form.appendChild(label);
  });

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'quiz-form-buttons';
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'button';
  submitBtn.className = 'submit-btn';
  submitBtn.textContent = 'Submit';
  submitBtn.disabled = true; // Disabled initially until option selected
  submitBtn.addEventListener('click', () => handleSubmit(q, form));
  buttonsDiv.appendChild(submitBtn);
  
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'next-btn';
  
  // Change button text for last question
  if (currentQuestionIndex === currentQuiz.length - 1) {
    nextBtn.textContent = 'Finish Quiz';
  } else {
    nextBtn.textContent = 'Next Question';
  }
  
  nextBtn.disabled = true; // Disabled initially until submitted
  nextBtn.addEventListener('click', () => moveToNextQuestion());
  buttonsDiv.appendChild(nextBtn);
  
  console.log("Button states for question", q.id, "- Submit disabled:", submitBtn.disabled, "Next disabled:", nextBtn.disabled);
  
  form.appendChild(buttonsDiv);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'quiz-result';
  form.appendChild(resultDiv);

  // Check if this question was already submitted and show feedback
  if (hasSubmitted[q.id]) {
    console.log("Question", q.id, "was already submitted, showing previous feedback");
    const selectedInput = form.querySelector('input[type="radio"]:checked');
    if (selectedInput) {
      const feedback = q.feedback?.[selectedInput.value];
      if (feedback) {
        const icon = feedback.correct ? '✅' : '❌';
        resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;
        submitBtn.disabled = true;
        nextBtn.disabled = false;
      }
    }
  }

  quizContainer.appendChild(form);
}

function handleOptionChange(q, form, input) {
  console.log("Option changed for question:", q.id, "selected:", input.value, "submitted:", hasSubmitted[q.id]);
  
  // If already submitted, just show feedback for learning
  if (hasSubmitted[q.id]) {
    const selected = input.value;
    const feedback = q.feedback?.[selected];
    const resultDiv = form.querySelector('.quiz-result');
    
    if (feedback) {
      const icon = feedback.correct ? '✅' : '❌';
      resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;
    } else {
      console.warn("No feedback found for option:", selected, "in question:", q.id);
    }
  } else {
    // Question not yet submitted - enable submit button
    const submitBtn = form.querySelector('.submit-btn');
    if (submitBtn) {
      submitBtn.disabled = false;
      console.log("Submit button enabled for question:", q.id);
    }
  }
}

function moveToNextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuiz.length) {
    renderQuestion();
  } else {
    showFinalScore();
  }
}

function handleSubmit(q, form) {
  if (hasSubmitted[q.id]) return; // Only first submission counts

  const resultDiv = form.querySelector('.quiz-result');
  let isCorrect = false;

  // Handle multiple choice questions only
  const selected = [...form.elements].find(el => el.checked);
  if (!selected) {
    console.warn("No option selected for question:", q.id);
    return;
  }
  
  const feedback = q.feedback?.[selected.value];
  if (!feedback) {
    console.error("No feedback found for option:", selected.value, "in question:", q.id);
    resultDiv.innerHTML = '<span>Error: Feedback not available</span>';
    return;
  }
  
  isCorrect = feedback.correct;
  const icon = feedback.correct ? '✅' : '❌';
  resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;

  if (isCorrect) score++;
  hasSubmitted[q.id] = true;

  // Enable the next button and disable submit button
  const nextBtn = form.querySelector('.next-btn');
  const submitBtn = form.querySelector('.submit-btn');
  if (nextBtn) nextBtn.disabled = false;
  if (submitBtn) submitBtn.disabled = true;
  
  updateProgress();
}

function updateProgress() {
  progressDisplay.textContent = `Question ${Math.min(currentQuestionIndex + 1, currentQuiz.length)} of ${currentQuiz.length}`;
  scoreDisplay.textContent = `Score: ${score} / ${currentQuiz.length}`;
}

function showFinalScore() {
  quizContainer.innerHTML = `<h3>🎉 Quiz Complete!</h3><p>Your final score: <strong>${score} / ${currentQuiz.length}</strong></p>`;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Convert string difficulty to numeric value for filtering
function getDifficultyNumeric(difficulty) {
  if (typeof difficulty === 'number') {
    return difficulty; // Already numeric (legacy format)
  }
  
  const diffStr = difficulty?.toLowerCase();
  switch (diffStr) {
    case 'easy': return 2; // Middle of 1-3 range
    case 'medium': return 5.5; // Middle of 4-7 range  
    case 'hard': return 8.5; // Middle of 7-10 range
    default: 
      console.warn("Unknown difficulty value:", difficulty);
      return 5; // Default to medium
  }
}

// Map new question types to internal types
function mapQuestionType(type) {
  switch (type) {
    case 'MCQ': return 'multiple_choice';
    case 'FITB': return 'fill_blank';
    case 'SelectAll': return 'multiple_select';
    default: return type; // Keep as is for legacy
  }
}
// Debug output for quiz loading
console.log("Quiz manifest URL:", quizManifestUrl);
