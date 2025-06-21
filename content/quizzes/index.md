---
layout: course_page
title: Infinite Quizzes
published: true
section_slug: quizzes
sidebar_context: open-none
---

<div id="quiz-setup" class="quiz-setup">
  <h3 class="quiz-title">🎯 <span class="title-text">Test Your Knowledge</span> <span class="toggle-icon">▼</span></h3>
  <div class="quiz-content">
  
  <div class="quiz-options">
    <div class="quiz-option-col">
      <div class="difficulty-selector">
        <label><strong>Difficulty:</strong></label>
        <div class="difficulty-buttons">
          <button type="button" class="diff-btn" id="diffEasy" data-min="1" data-max="3">Easy</button>
          <button type="button" class="diff-btn active" id="diffMedium" data-min="4" data-max="7">Medium</button>
          <button type="button" class="diff-btn" id="diffHard" data-min="8" data-max="10">Advanced</button>
        </div>
        <input type="hidden" id="difficultyMin" value="4">
        <input type="hidden" id="difficultyMax" value="7">
      </div>
    </div>
    
    <div class="quiz-option-col">
      <div class="content-selector">
        <div class="quiz-row">
          <label><strong>Topic:</strong></label>
          <select id="topicSelect">
            <option value="">Any Topic</option>
            <option value="topic-quiz">By Module</option>
          </select>
        </div>
        
        <div class="module-section" id="moduleSection">
          <div class="quiz-row">
            <label><strong>Module:</strong></label>
            <select id="moduleSelect">
              <option value="">-- Any Module --</option>
            </select>
          </div>
          
          <div class="quiz-row">
            <label><strong>Lesson:</strong></label>
            <select id="lessonSelect">
              <option value="">-- Any Lesson --</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <button id="startQuiz" class="start-quiz-btn">Start Quiz</button>
  </div>
</div>

<hr>

<div id="quiz-section" class="quiz-section">
  <!-- Dynamic question will appear here -->
</div>

<hr>

<div id="quiz-scoring" class="quiz-scoring">
  <div class="quiz-progress-container">
    <span class="progress-label">📊</span>
    <span id="quiz-progress">Not started</span>
    <span class="progress-divider">|</span>
    <span id="quiz-score">Score: 0 / 0</span>
  </div>
</div>
<link rel="stylesheet" href="{{ site.baseurl }}/css/infinite_quiz.css" />
