document.addEventListener('DOMContentLoaded', () => {
    const baseurl = window.BASEURL || '';
    const feedbackUrl = `${baseurl}/quizFeedback.json`;
    let feedbackData = {};

    // Function to generate quiz HTML
    function generateQuizHtml(quizId, quizData) {
        const form = document.createElement('form');
        form.id = quizId;
        form.className = 'quiz-form';

        const questionP = document.createElement('p');
        questionP.innerHTML = quizData.question;
        form.appendChild(questionP);

        quizData.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = quizData.type === 'boolean' ? 'radio' : 'radio';
            input.name = quizId;
            input.value = option.value;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${option.text}`));
            form.appendChild(label);
        });

        const resultDiv = document.createElement('div');
        resultDiv.className = 'quiz-result';
        form.appendChild(resultDiv);

        return form;
    }

    // Initialize quizzes
    fetch(feedbackUrl)
        .then(res => res.json())
        .then(data => {
            feedbackData = data;

            // Find all quiz placeholders
            document.querySelectorAll('.quiz[data-quiz-id]').forEach(placeholder => {
                const quizId = placeholder.dataset.quizId;
                const quizData = feedbackData[quizId];

                if (!quizData) {
                    console.warn(`⚠️ No quiz data found for ${quizId}`);
                    return;
                }

                // Generate and insert quiz form
                const quizForm = generateQuizHtml(quizId, quizData);
                placeholder.replaceWith(quizForm);

                // Add event listener
                quizForm.addEventListener('change', event => {
                    const selected = event.target.value;
                    const feedback = quizData.feedback[selected];
                    
                    if (!feedback) {
                        console.warn(`⚠️ No feedback found for ${selected} under ${quizId}`);
                        return;
                    }

                    const resultDiv = quizForm.querySelector('.quiz-result');
                    if (!resultDiv) return;
                    
                    const icon = feedback.correct ? '✅' : '❌';
                    resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;
                });
            });
        })
        .catch(err => console.error('❌ Failed to load quizFeedback.json:', err));
});
