document.addEventListener('DOMContentLoaded', () => {
  const sidebarContainer = document.getElementById('lesson-sidebar');
  if (!sidebarContainer) return;

  const currentSlug = document.body.dataset.moduleSlug;
  const baseurl = window.BASEURL || '';

  console.log("Script loaded");
  console.log("Current module slug:", currentSlug);

  fetch(`${baseurl}/lessons.json`)
    .then(res => res.json())
    .then(lessons => {
      console.log("Fetched lessons:", lessons);

      const filtered = lessons.filter(l => l.module_slug === currentSlug);

      if (!filtered.length) {
        console.warn(`No lessons found for module_slug: '${currentSlug}'`);
        console.warn('Current URL:', window.location.pathname);
        sidebarContainer.innerHTML = `<p>No lessons found for this module.</p>`;
        return;
      }

      let html = '<ul class="lesson-list">';
      filtered.forEach((lesson, index) => {
        let classList = [];

        if (window.location.pathname.endsWith(lesson.url)) {
          classList.push('active');
        }
        if (index === 0) {
          classList.push('first');
        }
        if (index === filtered.length - 1) {
          classList.push('last');
        }

        const classAttr = classList.length ? ` class="${classList.join(' ')}"` : '';
        html += `<li${classAttr}><a href="${baseurl}${lesson.url}">${lesson.title}</a></li>`;
      });
      html += '</ul>';
      sidebarContainer.innerHTML = html;
    })
    .catch(err => {
      console.error('Failed to load lessons.json:', err);
      sidebarContainer.innerHTML = `<p>Error loading lessons. Please try again later.</p>`;
    });
});
