document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  if (!sidebarContainer) {
    console.error("Sidebar container #sidebar-container not found.");
    return;
  }

  const baseurl = window.BASEURL || "";
  const modulesPath = `${baseurl}/modules.json`;
  const lessonsPath = `${baseurl}/lessons.json`;

  async function buildAndInitSidebar() {
    try {
      const [modulesRes, lessonsRes] = await Promise.all([
        fetch(modulesPath),
        fetch(lessonsPath)
      ]);

      if (!modulesRes.ok || !lessonsRes.ok) {
        throw new Error(`Failed to fetch data files: ${modulesRes.statusText}, ${lessonsRes.statusText}`);
      }

      const modules = await modulesRes.json();
      const lessons = await lessonsRes.json();

      const lessonsByModule = lessons.reduce((acc, lesson) => {
        const slug = lesson.module_slug;
        if (!acc[slug]) { acc[slug] = []; }
        acc[slug].push(lesson);
        return acc;
      }, {});

      const sidebarHTML = modules.map(module => {
        const moduleLessons = lessonsByModule[module.slug] || [];
        
        // --- MODIFICATION START ---
        // We now include the index to add 'first' and 'last' classes.
        const lessonsHTML = moduleLessons.map((lesson, index) => {
          const classList = [];
          if (index === 0) {
            classList.push("first");
          }
          if (index === moduleLessons.length - 1) {
            classList.push("last");
          }
          const classAttr = classList.length ? ` class="${classList.join(" ")}"` : "";
          
          return `<li${classAttr}><a href="${baseurl}${lesson.url}">${lesson.title}</a></li>`;
        }).join('');
        // --- MODIFICATION END ---

        return `
          <div class="module" id="module-${module.slug}">
            <button class="module__header" aria-expanded="false" aria-controls="lessons-${module.slug}">
              ${module.title}
              <span class="module__icon"></span>
            </button>
            <ul class="lesson-list module__lessons" id="lessons-${module.slug}">
              ${lessonsHTML}
            </ul>
          </div>
        `;
      }).join('');
      
      if (!sidebarHTML) {
        sidebarContainer.innerHTML = '<p>No modules found.</p>';
        return;
      }

      sidebarContainer.innerHTML = sidebarHTML;

      initializeAccordion();
      openCurrentModule();

    } catch (err) {
      console.error("Failed to build sidebar:", err);
      sidebarContainer.innerHTML = `<p>Error loading sidebar content.</p>`;
    }
  }

  function initializeAccordion() {
    const moduleHeaders = document.querySelectorAll('.module__header');
    moduleHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const currentModule = this.parentElement;
        const isModuleActive = currentModule.classList.contains('is-active');

        document.querySelectorAll('.module').forEach(module => {
          if(module !== currentModule) {
            module.classList.remove('is-active');
            module.querySelector('.module__header').setAttribute('aria-expanded', 'false');
          }
        });

        currentModule.classList.toggle('is-active');
        this.setAttribute('aria-expanded', currentModule.classList.contains('is-active'));
      });
    });
  }

  function openCurrentModule() {
    const currentPagePath = window.location.pathname;
    const lessonLinks = document.querySelectorAll(".module__lessons a");

    for (const link of lessonLinks) {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPagePath) {
        
        // --- MODIFICATION START ---
        // Add the 'active' class to the parent <li> for styling.
        if (link.parentElement) {
            link.parentElement.classList.add("active");
        }
        // --- MODIFICATION END ---

        const parentModule = link.closest(".module");
        if (parentModule) {
          parentModule.classList.add("is-active");
          parentModule.querySelector(".module__header").setAttribute("aria-expanded", "true");
        }
        break; 
      }
    }
  }

  buildAndInitSidebar();
});