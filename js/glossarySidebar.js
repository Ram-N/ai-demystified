document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar-container");
  if (!sidebarContainer) {
    console.error("Sidebar container #sidebar-container not found.");
    return;
  }

  const baseurl = window.BASEURL || "";
  const glossaryPath = `${baseurl}/glossary_entries.json`;
  let allGlossaryEntries = []; // Store all entries for filtering

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

      // Store all entries for filtering
      allGlossaryEntries = sortedEntries;

      // Render the sidebar with all entries
      renderGlossarySidebar(sortedEntries);
      
      // Setup search functionality
      setupGlossarySearch();
      
    } catch (err) {
      console.error("Failed to build glossary sidebar:", err);
      sidebarContainer.innerHTML = "<p>Error loading glossary content.</p>";
    }
  }

  function renderGlossarySidebar(entries) {
    const currentPath = window.location.pathname;

    // Group entries by first letter for better organization (optional)
    const entriesByLetter = entries.reduce((acc, entry) => {
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

    // Create search box for glossary
    const searchBox = `
      <div class="glossary-search">
        <input type="text" id="glossary-search-input" class="form-control" placeholder="Search glossary...">
      </div>
    `;

    // Option 2: Simple list
    const entriesList = `
      <div class="glossary-list">
        <ul class="glossary-entries" id="glossary-entries-list">
          <li><a href="${baseurl}/content/glossary/index" class="${currentPath.endsWith('/glossary/index') || currentPath.endsWith('/glossary/') ? 'is-current-entry' : ''}">Glossary Home</a></li>
          ${entries
            .map((entry) => {
              const isCurrentEntry = baseurl + entry.url === currentPath;
              const entryClass = isCurrentEntry ? ' class="is-current-entry"' : '';
              return `<li><a href="${baseurl}${entry.url}"${entryClass} data-term="${entry.title.toLowerCase()}">${entry.title}</a></li>`;
            })
            .join("")}
        </ul>
      </div>
    `;
    
    // Combine search box and entries list
    const sidebarHTML = searchBox + entriesList;

    if (!sidebarHTML) {
      sidebarContainer.innerHTML = "<p>No glossary entries found.</p>";
      return;
    }

    sidebarContainer.innerHTML = sidebarHTML;
    initializeGlossarySidebarState();
  }

  function setupGlossarySearch() {
    const searchInput = document.getElementById('glossary-search-input');
    if (!searchInput) return;

    // Debounce function to limit how often the filter runs
    function debounce(func, delay) {
      let timeout;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
      };
    }

    // Filter entries based on search term
    const filterEntries = debounce(function() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm.length === 0) {
        // If search is empty, show all entries
        renderGlossarySidebar(allGlossaryEntries);
        return;
      }
      
      // Filter entries that match the search term
      const filteredEntries = allGlossaryEntries.filter(entry => 
        entry.title.toLowerCase().includes(searchTerm) || 
        entry.slug.toLowerCase().includes(searchTerm)
      );
      
      // Re-render sidebar with filtered entries
      renderGlossarySidebar(filteredEntries);
      
      // If we have results, show a count
      const entriesList = document.getElementById('glossary-entries-list');
      if (entriesList && filteredEntries.length > 0) {
        // Account for the "Glossary Home" entry
        const actualCount = entriesList.children.length - 1;
        const resultsText = document.createElement('li');
        resultsText.className = 'search-results-count';
        resultsText.textContent = `Found ${actualCount} ${actualCount === 1 ? 'result' : 'results'}`;
        entriesList.insertBefore(resultsText, entriesList.firstChild.nextSibling);
      }
    }, 300);

    // Add event listener to the search input
    searchInput.addEventListener('input', filterEntries);
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