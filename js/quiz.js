document.addEventListener('DOMContentLoaded', () => {    const baseurl = window.BASEURL || '';
    const feedbackUrl = `${baseurl}/quizFeedback.json`;
    const quizForms = document.querySelectorAll('form[id^="pop_quiz_"]');

    let feedbackData = {};  // ✅ declare in outer scope

    fetch(feedbackUrl)
        .then(res => res.json())
        .then(data => {
            feedbackData = data; // ✅ assign here after fetch

            quizForms.forEach(form => {
                const questionId = form.id;                form.addEventListener('change', event => {
                    // Support both old and new ID formats
                    if (!event.target.name.includes(questionId)) return;

                    const selected = event.target.value;

                    console.log('🧩 Question ID:', questionId);
                    console.log('🧪 Selected Choice:', selected);
                    console.log('📁 feedbackData:', feedbackData);
                    console.log('📂 feedbackData[questionId]:', feedbackData[questionId]);

                    if (!feedbackData[questionId]) {
                        console.warn(`⚠️ No feedback found for ${questionId}`);
                        return;
                    }

                    const feedback = feedbackData[questionId][selected];
                    if (!feedback) {
                        console.warn(`⚠️ No feedback found for ${selected} under ${questionId}`);
                        return;
                    }

                    const resultDiv = form.querySelector('.quiz-result');
                    if (!resultDiv) return;
                    console.log('📊 past resultDiv');
                    const icon = feedback.correct ? '✅' : '❌';
                    resultDiv.innerHTML = `${icon} <span>${feedback.text}</span>`;
                });
            });
        })
        .catch(err => console.error('❌ Failed to load quizFeedback.json:', err));
});
