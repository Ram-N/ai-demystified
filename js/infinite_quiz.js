// infinite_quiz.js

let quizData = {};
let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 5; // default quiz length
let hasSubmitted = {}; // tracks whether answer has been submitted for scoring

const baseurl = window.BASEURL || '/ai-demystified';
const quizBankUrl = `${baseurl}/assets/data/quiz_bank.json`;
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

// Load quiz data
fetch(quizBankUrl)
  .then(res => {
    console.log("Quiz data response:", res);
    return res.json();
  })
  .then(data => {
    console.log("Quiz data loaded:", data);
    quizData = Object.values(data);
  })
  .catch(err => {
    console.error("Error loading quiz data:", err, "URL was:", quizBankUrl);
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
    // Check difficulty range
    const diffMatch = q.difficulty >= minDiff && q.difficulty <= maxDiff;
    
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
    
    console.log("Question filtering:", {
      id: q.id,
      difficulty: q.difficulty, 
      diffMatch,
      module: q.source?.module,
      modMatch,
      lesson: q.source?.lesson,
      lessonMatch
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
  if (!q) return;

  // Update progress counter as soon as question is displayed
  updateProgress();

  const form = document.createElement('form');
  form.id = q.id;
  form.className = 'quiz-form';

  const questionP = document.createElement('p');
  questionP.innerHTML = `<strong>Q${currentQuestionIndex + 1}:</strong> ${q.question}`;
  form.appendChild(questionP);

  // Track if any option is selected
  
  q.options.forEach(option => {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = q.type === 'multiple_select' ? 'checkbox' : 'radio';
    input.name = q.id;
    input.value = option.value;
    input.addEventListener('change', () => {
      handleOptionChange(q, form, input);
      
      // Enable submit button once an option is selected
      if (!hasSubmitted[q.id]) {
        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) submitBtn.disabled = false;
      }
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
  submitBtn.disabled = true; // Disabled initially until selection
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
  
  nextBtn.disabled = true; // Disabled initially
  nextBtn.addEventListener('click', () => moveToNextQuestion());
  buttonsDiv.appendChild(nextBtn);
  
  form.appendChild(buttonsDiv);

  const resultDiv = document.createElement('div');
  resultDiv.className = 'quiz-result';
  form.appendChild(resultDiv);

  quizContainer.appendChild(form);
}

function handleOptionChange(q, form, input) {
  // If already submitted, just show feedback for learning
  if (hasSubmitted[q.id]) {
    const selected = input.value;
    const feedback = q.feedback[selected];
    const resultDiv = form.querySelector('.quiz-result');
    
    if (feedback) {
      const icon = feedback.correct ? '✅' : '❌';
      resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;
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

  const selected = [...form.elements].find(el => el.checked);
  if (!selected) return;

  const feedback = q.feedback[selected.value];
  const resultDiv = form.querySelector('.quiz-result');
  if (!feedback) return;

  const icon = feedback.correct ? '✅' : '❌';
  resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;

  if (feedback.correct) score++;
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
// Debug output for quiz loading
console.log("Quiz bank URL:", quizBankUrl);
