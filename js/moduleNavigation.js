document.addEventListener('DOMContentLoaded', () => {
  const navContainer = document.getElementById('module-navigation');
  if (!navContainer) return;

  const currentSlug = document.body.dataset.moduleSlug;  // ✅ correct
  const baseurl = window.BASEURL || '';
  console.log("Current module slug:", currentSlug);


fetch(`${baseurl}/modules.json`)
  .then(res => res.json())
  .then(modules => {  // This defines 'modules'
    const index = modules.findIndex(m => m.slug === currentSlug);
    if (index === -1) return;

    console.log("Current module slug:", currentSlug);
    console.log("Loaded modules:", modules);

      const prev = modules[index - 1];
      const next = modules[index + 1];

      let html = '<div class="topic-nav-wrap d-flex justify-content-between gap-4">';

      // Previous
      if (prev) {
        html += `
          <div class="pagination-section text-left">
            <div class="title">Previous Module</div>
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
            <div class="title">Next Module</div>
            <a class="next" rel="next" href="${baseurl}${next.url}">
              ${next.title} →
            </a>
          </div>`;
      }

      html += '</div>';
      navContainer.innerHTML = html;
    })
    .catch(err => console.error('Failed to load modules.json:', err));
});
