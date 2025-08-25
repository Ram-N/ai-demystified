document.addEventListener("DOMContentLoaded", () => {
  const baseurl = window.BASEURL || "";
  const modulesPath = `${baseurl}/modules.json`;
  const lessonsPath = `${baseurl}/lessons.json`;
  const glossaryPath = `${baseurl}/glossary_entries.json`;
  
  // Cache for search data
  let searchData = {
    lessons: [],
    glossary: []
  };
  
  // Initialize search functionality
  async function initSearch() {
    try {
      // Fetch all necessary data in parallel
      const [lessonsRes, glossaryRes] = await Promise.all([
        fetch(lessonsPath),
        fetch(glossaryPath)
      ]);

      if (!lessonsRes.ok || !glossaryRes.ok) {
        throw new Error(
          `Failed to fetch search data: ${lessonsRes.statusText}, ${glossaryRes.statusText}`
        );
      }

      // Parse JSON responses
      const lessons = await lessonsRes.json();
      const glossary = await glossaryRes.json();

      // Store in cache for searching
      searchData.lessons = lessons;
      searchData.glossary = glossary;

      // Set up search listeners
      setupSearchListeners();
      
      console.log("Search functionality initialized");
    } catch (err) {
      console.error("Failed to initialize search:", err);
    }
  }

  // Search through lessons and glossary entries
  function performSearch(query) {
    if (!query || query.length < 2) {
      return { lessons: [], glossary: [] };
    }

    query = query.toLowerCase().trim();

    // Search lessons
    const matchedLessons = searchData.lessons.filter(lesson => 
      lesson.title.toLowerCase().includes(query) || 
      (lesson.topic_slug && lesson.topic_slug.toLowerCase().includes(query))
    );

    // Search glossary
    const matchedGlossary = searchData.glossary.filter(entry => 
      entry.title.toLowerCase().includes(query) || 
      entry.slug.toLowerCase().includes(query)
    );

    return {
      lessons: matchedLessons,
      glossary: matchedGlossary
    };
  }

  // Render search results
  function renderSearchResults(results, resultsContainer) {
    if (!resultsContainer) return;

    // Clear previous results
    resultsContainer.innerHTML = "";

    // Check if we have any results
    const totalResults = results.lessons.length + results.glossary.length;
    if (totalResults === 0) {
      resultsContainer.innerHTML = '<p class="no-results">No results found. Try a different search term.</p>';
      resultsContainer.classList.add('active');
      return;
    }

    // Create container for results
    const resultsList = document.createElement('div');
    resultsList.className = 'search-results-list';

    // Add lesson results if any
    if (results.lessons.length > 0) {
      const lessonsSection = document.createElement('div');
      lessonsSection.className = 'search-results-section';
      lessonsSection.innerHTML = `<h3>Lessons (${results.lessons.length})</h3>`;
      
      const lessonsList = document.createElement('ul');
      results.lessons.forEach(lesson => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${baseurl}${lesson.url}">${lesson.title}</a>`;
        lessonsList.appendChild(li);
      });
      
      lessonsSection.appendChild(lessonsList);
      resultsList.appendChild(lessonsSection);
    }

    // Add glossary results if any
    if (results.glossary.length > 0) {
      const glossarySection = document.createElement('div');
      glossarySection.className = 'search-results-section';
      glossarySection.innerHTML = `<h3>Glossary (${results.glossary.length})</h3>`;
      
      const glossaryList = document.createElement('ul');
      results.glossary.forEach(entry => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${baseurl}${entry.url}">${entry.title}</a>`;
        glossaryList.appendChild(li);
      });
      
      glossarySection.appendChild(glossaryList);
      resultsList.appendChild(glossarySection);
    }

    // Add to the results container
    resultsContainer.appendChild(resultsList);
    resultsContainer.classList.add('active');
  }

  // Set up debounce for search input
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Set up search listeners
  function setupSearchListeners() {
    const searchForm = document.getElementById('site-search-form');
    const searchInput = document.getElementById('site-search-input');
    const searchResults = document.getElementById('site-search-results');
    
    if (!searchForm || !searchInput || !searchResults) {
      console.error("Search elements not found in the DOM");
      return;
    }

    // Prevent form submission
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });

    // Handle input with debounce
    const debouncedSearch = debounce(function() {
      const query = searchInput.value;
      
      if (!query || query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.classList.remove('active');
        return;
      }

      const results = performSearch(query);
      renderSearchResults(results, searchResults);
    }, 300);

    searchInput.addEventListener('input', debouncedSearch);

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchForm.contains(e.target)) {
        searchResults.classList.remove('active');
      }
    });

    // Toggle focus class for styling
    searchInput.addEventListener('focus', () => {
      searchForm.classList.add('is-focused');
      if (searchInput.value.length >= 2) {
        searchResults.classList.add('active');
      }
    });

    searchInput.addEventListener('blur', () => {
      searchForm.classList.remove('is-focused');
      // Don't hide results yet to allow clicking on them
    });
  }

  // Initialize search
  initSearch();
});