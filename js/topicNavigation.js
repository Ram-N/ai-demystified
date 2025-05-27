document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('topic-navigation');
  if (!navContainer) return;

  const currentSlug = document.body.dataset.topicSlug;
  const baseurl = window.BASEURL || '';

  fetch(`${baseurl}/topics.json`)
    .then(res => res.json())
    .then(topics => {
      const index = topics.findIndex(t => t.slug === currentSlug);
      if (index === -1) return;

      const prev = topics[index - 1];
      const next = topics[index + 1];

      let html = '<div class="topic-nav-wrap d-flex justify-content-between gap-4">';



      // Previous
      if (prev) {
        html += `
          <div class="pagination-section text-left">
            <div class="title">Previous Topic</div>
            <a class="prev" rel="prev" href="${baseurl}${prev.url}">
              ← ${prev.title}
            </a>
          </div>`;
      } else {
        html += '<div class="pagination-section"></div>';
      }

      // Next
      if (next) {
        html += `
          <div class="pagination-section text-right">
            <div class="title">Next Topic</div>
            <a class="next" rel="next" href="${baseurl}${next.url}">
              ${next.title} →
            </a>
          </div>`;
      }

      html += '</div>';
      navContainer.innerHTML = html;
    })
    .catch(err => console.error('Failed to load topics.json:', err));
});
