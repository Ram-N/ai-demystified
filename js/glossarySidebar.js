document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  if (!sidebarContainer) {
    console.error("Sidebar container #sidebar-container not found.");
    return;
  }

  const baseurl = window.BASEURL || "";
  const glossaryPath = `${baseurl}/glossary_entries.json`;

  async function buildAndInitGlossarySidebar() {
    try {
      const glossaryRes = await fetch(glossaryPath);

      if (!glossaryRes.ok) {
        throw new Error(`Failed to fetch glossary data: ${glossaryRes.statusText}`);
      }

      const glossaryEntries = await glossaryRes.json();
      
      // Sort entries alphabetically by title
      const sortedEntries = glossaryEntries.sort((a, b) => 
        a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
      );

      const currentPath = window.location.pathname;

      // Group entries by first letter for better organization (optional)
      const entriesByLetter = sortedEntries.reduce((acc, entry) => {
        const firstLetter = entry.title.charAt(0).toUpperCase();
        if (!acc[firstLetter]) {
          acc[firstLetter] = [];
        }
        acc[firstLetter].push(entry);
        return acc;
      }, {});

      // Create sidebar HTML - you can choose between grouped by letter or simple list
      // Option 1: Grouped by letter (commented out)
      /*
      const sidebarHTML = Object.keys(entriesByLetter)
        .sort()
        .map((letter) => {
          const entries = entriesByLetter[letter];
          const entriesHTML = entries
            .map((entry) => {
              const isCurrentEntry = baseurl + entry.url === currentPath;
              const entryClass = isCurrentEntry ? ' class="is-current-entry"' : '';
              return `<li><a href="${baseurl}${entry.url}"${entryClass}>${entry.title}</a></li>`;
            })
            .join("");

          return `
            <div class="glossary-section" id="glossary-${letter}">
              <button class="glossary-section__header" aria-expanded="true" aria-controls="entries-${letter}">
                ${letter}
                <span class="glossary-section__icon"></span>
              </button>
              <ul class="glossary-section__entries" id="entries-${letter}" role="region" aria-labelledby="glossary-${letter}-header">
                ${entriesHTML}
              </ul>
            </div>
          `;
        })
        .join("");
      */

      // Option 2: Simple list
      const sidebarHTML = `
        <div class="glossary-list">
          <ul class="glossary-entries">
            ${sortedEntries
              .map((entry) => {
                const isCurrentEntry = baseurl + entry.url === currentPath;
                const entryClass = isCurrentEntry ? ' class="is-current-entry"' : '';
                return `<li><a href="${baseurl}${entry.url}"${entryClass}>${entry.title}</a></li>`;
              })
              .join("")}
          </ul>
        </div>
      `;
      

      if (!sidebarHTML) {
        sidebarContainer.innerHTML = "<p>No glossary entries found.</p>";
        return;
      }

      sidebarContainer.innerHTML = sidebarHTML;
      initializeGlossarySidebarState();
      
    } catch (err) {
      console.error("Failed to build glossary sidebar:", err);
      sidebarContainer.innerHTML = "<p>Error loading glossary content.</p>";
    }
  }

  function initializeGlossarySidebarState() {
    const currentPath = window.location.pathname;
    let activeEntryFound = false;

    // Look for current glossary entry
    const currentEntry = document.querySelector(`.glossary-section__entries a[href="${currentPath}"]`);
    if (currentEntry) {
      const parentSection = currentEntry.closest(".glossary-section");
      if (parentSection) {
        parentSection.classList.add("is-active");
        parentSection.querySelector(".glossary-section__header").setAttribute("aria-expanded", "true");
        activeEntryFound = true;
        
        // Ensure current entry is visible
        setTimeout(() => {
          currentEntry.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 300);
      }
    }

    // Add click handlers for collapsible sections
    const sectionHeaders = document.querySelectorAll(".glossary-section__header");
    sectionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.closest(".glossary-section");
        const isExpanded = header.getAttribute("aria-expanded") === "true";
        
        // Toggle current section
        header.setAttribute("aria-expanded", !isExpanded);
        section.classList.toggle("is-active");
      });
    });

    // If no active entry found, expand all sections by default
    if (!activeEntryFound) {
      const allSections = document.querySelectorAll(".glossary-section");
      allSections.forEach((section) => {
        section.classList.add("is-active");
        section.querySelector(".glossary-section__header").setAttribute("aria-expanded", "true");
      });
    }
  }

  buildAndInitGlossarySidebar();
});