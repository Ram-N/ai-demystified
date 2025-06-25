document.addEventListener("DOMContentLoaded", () => {
  const baseurl = window.BASEURL || "";
  const glossaryPath = `${baseurl}/glossary_entries.json`;
  let glossaryEntries = [];
  let currentIndex = 0;

  async function fetchGlossaryEntries() {
    const res = await fetch(glossaryPath);
    if (!res.ok) throw new Error(`Failed to fetch glossary data: ${res.statusText}`);
    const entries = await res.json();
    return Array.isArray(entries) ? entries : [];
  }

  function adjustFrontFontSize(frontElem) {
    if (!frontElem) return;
    frontElem.classList.remove('shrink');
    // Shrink font if text is too long
    if (frontElem.textContent.length > 28 || frontElem.scrollWidth > frontElem.clientWidth) {
      frontElem.classList.add('shrink');
    }
  }

  function updateCard(entry) {
    const frontElem = document.querySelector('.glossary-card-front');
    const backElem = document.querySelector('.glossary-card-back');
    if (frontElem && entry && entry.title) {
      frontElem.textContent = entry.title;
      setTimeout(() => adjustFrontFontSize(frontElem), 10);
    }
    if (backElem && entry && entry.url) {
      // Fetch the glossary entry page and extract the definition
      const entryUrl = baseurl + entry.url;
      fetch(entryUrl)
        .then(r => r.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          let defElem = doc.querySelector("#Definition, h2#Definition, h3#Definition, h2, h3");
          let defText = "";
          if (defElem) {
            let next = defElem.nextElementSibling;
            while (next && next.tagName !== 'P' && next.tagName !== 'DIV') {
              next = next.nextElementSibling;
            }
            defText = next ? next.textContent.trim() : defElem.textContent.trim();
          } else {
            let p = doc.querySelector("p");
            defText = p ? p.textContent.trim() : "No definition found.";
          }
          backElem.textContent = defText;
          backElem.style.fontFamily = 'sans-serif';
          backElem.style.fontSize = '20px';
          backElem.style.lineHeight = '1.3';
          backElem.style.padding = '24px';
          backElem.style.display = 'flex';
          backElem.style.alignItems = 'center';
          backElem.style.justifyContent = 'center';
          backElem.style.textAlign = 'center';
        })
        .catch(() => {
          backElem.textContent = "Definition not found.";
        });
    }
  }

  function showCard(index) {
    if (!glossaryEntries.length) return;
    if (index < 0) index = glossaryEntries.length - 1;
    if (index >= glossaryEntries.length) index = 0;
    currentIndex = index;
    updateCard(glossaryEntries[currentIndex]);
  }

  function setupArrows() {
    const leftArrow = document.querySelector('.glossary-card-arrow-left');
    const rightArrow = document.querySelector('.glossary-card-arrow-right');
    if (leftArrow) {
      leftArrow.addEventListener('click', () => showCard(currentIndex - 1));
    }
    if (rightArrow) {
      rightArrow.addEventListener('click', () => showCard(currentIndex + 1));
    }
  }

  function setupShuffleButton() {
    const shuffleButton = document.querySelector('#shuffle-button');
    if (shuffleButton) {
      shuffleButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * glossaryEntries.length);
        showCard(randomIndex);
      });
    }
  }

  async function init() {
    glossaryEntries = await fetchGlossaryEntries();
    if (!glossaryEntries.length) return;
    // Pick a random starting index
    currentIndex = Math.floor(Math.random() * glossaryEntries.length);
    showCard(currentIndex);
    setupArrows();
    setupShuffleButton();
  }

  init();
});
