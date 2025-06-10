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
        fetch(lessonsPath),
      ]);

      if (!modulesRes.ok || !lessonsRes.ok) {
        throw new Error(
          `Failed to fetch data files: ${modulesRes.statusText}, ${lessonsRes.statusText}`
        );
      }

      const modules = await modulesRes.json();
      const lessons = await lessonsRes.json();

      const currentPath = window.location.pathname;
      const lessonsByModule = lessons.reduce((acc, lesson) => {
        const slug = lesson.module_slug;
        if (!acc[slug]) {
          acc[slug] = [];
        }
        acc[slug].push(lesson);
        return acc;
      }, {});

      const sidebarHTML = modules
        .map((module) => {
          const moduleLessons = lessonsByModule[module.slug] || [];
          const lessonsHTML = moduleLessons
            .map((lesson) => {
              const isCurrentLesson = baseurl + lesson.url === currentPath;
              const lessonClass = isCurrentLesson ? ' class="is-current-lesson"' : '';
              return `<li><a href="${baseurl}${lesson.url}"${lessonClass}>${lesson.title}</a></li>`;
            })
            .join("");

          return `
            <div class="module" id="module-${module.slug}">
              <button class="module__header" aria-expanded="false" aria-controls="lessons-${module.slug}">
                ${module.title}
                <span class="module__icon"></span>
              </button>
              <ul class="module__lessons" id="lessons-${module.slug}" role="region" aria-labelledby="module-${module.slug}-header">
                ${lessonsHTML}
              </ul>
            </div>
          `;
        })
        .join("");

      if (!sidebarHTML) {
        sidebarContainer.innerHTML = "<p>No modules found.</p>";
        return;
      }

      sidebarContainer.innerHTML = sidebarHTML;
      initializeAccordion();
      initializeSidebarState();
      
      // Enhance keyboard navigation
      enhanceKeyboardNavigation();
    } catch (err) {
      console.error("Failed to build sidebar:", err);
      sidebarContainer.innerHTML = "<p>Error loading sidebar content.</p>";
    }
  }

  function initializeAccordion() {
    const moduleHeaders = document.querySelectorAll(".module__header");
    
    moduleHeaders.forEach((header) => {
      header.addEventListener("click", function(e) {
        const currentModule = this.parentElement;
        const wasActive = currentModule.classList.contains("is-active");
        
        // Close all other modules
        document.querySelectorAll(".module").forEach((module) => {
          if (module !== currentModule) {
            module.classList.remove("is-active");
            const header = module.querySelector(".module__header");
            header.setAttribute("aria-expanded", "false");
          }
        });
        
        // Toggle current module
        currentModule.classList.toggle("is-active");
        this.setAttribute("aria-expanded", !wasActive);
        
        // Smooth scroll into view if needed
        if (!wasActive) {
          setTimeout(() => {
            const bounds = currentModule.getBoundingClientRect();
            const isPartiallyVisible = bounds.top >= 0 && bounds.bottom <= window.innerHeight;
            if (!isPartiallyVisible) {
              currentModule.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          }, 300); // Wait for animation
        }
      });
    });
  }

  function initializeSidebarState() {
    const currentPath = window.location.pathname;
    let activeModuleFound = false;

    // Look for current lesson
    const currentLesson = document.querySelector(`.module__lessons a[href="${currentPath}"]`);
    if (currentLesson) {
      const parentModule = currentLesson.closest(".module");
      if (parentModule) {
        parentModule.classList.add("is-active");
        parentModule.querySelector(".module__header").setAttribute("aria-expanded", "true");
        activeModuleFound = true;
        
        // Ensure current lesson is visible
        setTimeout(() => {
          currentLesson.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      }
    }

    // If no active lesson found, check for module context
    if (!activeModuleFound) {
      const moduleSlug = document.body.dataset.moduleSlug;
      if (moduleSlug) {
        const moduleToOpen = document.getElementById(`module-${moduleSlug}`);
        if (moduleToOpen) {
          moduleToOpen.classList.add("is-active");
          moduleToOpen.querySelector(".module__header").setAttribute("aria-expanded", "true");
          activeModuleFound = true;
        }
      }
    }

    // If still no active module, open first one on index page
    if (!activeModuleFound && document.body.dataset.sidebarContext === "open-first") {
      const firstModule = document.querySelector(".module");
      if (firstModule) {
        firstModule.classList.add("is-active");
        firstModule.querySelector(".module__header").setAttribute("aria-expanded", "true");
      }
    }
  }

  function enhanceKeyboardNavigation() {
    const moduleHeaders = document.querySelectorAll(".module__header");
    
    moduleHeaders.forEach((header, index) => {
      header.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            if (header.getAttribute("aria-expanded") === "true") {
              // Focus first lesson link if module is open
              const firstLink = header.nextElementSibling?.querySelector("a");
              firstLink?.focus();
            } else {
              // Focus next module if closed
              moduleHeaders[index + 1]?.focus();
            }
            break;
          case "ArrowUp":
            e.preventDefault();
            if (index > 0) {
              moduleHeaders[index - 1].focus();
            }
            break;
          case "Home":
            e.preventDefault();
            moduleHeaders[0].focus();
            break;
          case "End":
            e.preventDefault();
            moduleHeaders[moduleHeaders.length - 1].focus();
            break;
        }
      });
    });

    // Enable arrow key navigation within lesson lists
    document.querySelectorAll(".module__lessons").forEach(list => {
      const links = Array.from(list.querySelectorAll("a"));
      links.forEach((link, index) => {
        link.addEventListener("keydown", (e) => {
          switch (e.key) {
            case "ArrowDown":
              e.preventDefault();
              links[index + 1]?.focus();
              break;
            case "ArrowUp":
              e.preventDefault();
              if (index === 0) {
                // Focus module header if at first lesson
                link.closest(".module")?.querySelector(".module__header").focus();
              } else {
                links[index - 1]?.focus();
              }
              break;
          }
        });
      });
    });
  }

  buildAndInitSidebar();
});
