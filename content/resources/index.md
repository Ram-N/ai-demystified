---
layout: course_page
title: Gen AI Resources around the web
published: true
section_slug: resources
sidebar_context: open-none
---

<link rel="stylesheet" href="{{site.baseurl}}/css/cards.css">

# Gen AI Resources around the web

Welcome to the "AI Demystified" resources hub! This section is designed to help you continue your learning journey in Artificial Intelligence. Whether you prefer reading, watching, or hands-on practice, you'll find a curated list of beginner-friendly resources to deepen your understanding of AI concepts and applications.

This chapter curates hand-picked materials from around the web to deepen your understanding of AI beyond our core lessons.

---

## Explore Our AI Resources

Navigate through the categories below to find the perfect resources for your learning style:

<div class="resources-grid">
  <!-- Card 1: AI Courses -->
  <div class="resource-card" data-card-id="courses">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/course_elements_of_ai.png" alt="AI Courses" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>AI Courses</h3>
      <ul>
        <li>Elements of AI</li>
        <li>FastAI</li>
        <li>Google AI Education</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/courses/">Explore Courses →</a>
    </div>
  </div>

  <!-- Card 2: Books -->
  <div class="resource-card" data-card-id="books">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/book_ai_superpowers.jpg" alt="Books" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>Books</h3>
      <ul>
        <li>AI Superpowers</li>
        <li>You Look Like a Thing and I Love You</li>
        <li>Rebooting AI</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/books/">Explore Books →</a>
    </div>
  </div>

  <!-- Card 3: YouTube Channels -->
  <div class="resource-card" data-card-id="videos">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/video_3b1b_llm_playlist.png" alt="YouTube Channels" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>YouTube Channels</h3>
      <ul>
        <li>3Blue1Brown</li>
        <li>Two Minute Papers</li>
        <li>Lex Fridman</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/videos/">Explore Videos →</a>
    </div>
  </div>

  <!-- Card 4: Blogs & Articles -->
  <div class="resource-card" data-card-id="blogs">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/blog_openai.jpg" alt="Blogs & Articles" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>Blogs & Articles</h3>
      <ul>
        <li>Distill.pub</li>
        <li>The Batch by Andrew Ng</li>
        <li>Towards Data Science</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/genai-blogs/">Explore Articles →</a>
    </div>
  </div>

  <!-- Card 5: Podcasts -->
  <div class="resource-card" data-card-id="podcasts">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/podcast_twiml.jpg" alt="Podcasts" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>Podcasts</h3>
      <ul>
        <li>Lex Fridman Podcast</li>
        <li>TWIML AI Podcast</li>
        <li>AI in Business</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/podcasts/">Explore Podcasts →</a>
    </div>
  </div>

  <!-- Card 6: Interactive Tools -->
  <div class="resource-card" data-card-id="tools">
    <div class="card-image-container">
      <img class="card-image" src="{{site.baseurl}}/content/resources/images/tools_google_teachable_machine.jpg" alt="Interactive Tools" style="transform: scale(1.0); object-position: 50% 50%;" />
    </div>
    <div class="card-content">
      <h3>Interactive Tools</h3>
      <ul>
        <li>Teachable Machine</li>
        <li>AI Experiments by Google</li>
        <li>ChatGPT</li>
      </ul>
      <a class="card-link" href="{{site.baseurl}}/content/resources/ai-tools/">Explore Tools →</a>
    </div>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  // Card image sources with configuration for each image
  // Each image can have: src, zoom (scale factor), posX and posY (percentage offset)
  const cardImages = {
    courses: [
      { src: '{{site.baseurl}}/content/resources/images/course_elements_of_ai.png', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/course_fast_ai.jpg', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/course_google_ai_for_education.png', zoom: 0.7, posX: 50, posY: 50 }
    ],
    books: [
      { src: '{{site.baseurl}}/content/resources/images/book_ai_superpowers.jpg', zoom: 0.7, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/book_rebooting_ai.jpg', zoom: 0.75, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/book_why_machines_learn.jpg', zoom: 0.5, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/book_you_look.jpg', zoom: 0.7, posX: 50, posY: 50 }
    ],
    videos: [
      { src: '{{site.baseurl}}/content/resources/images/video_3b1b_llm_playlist.png', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/video_2minute_papers.jpg', zoom: 0.7, posX: 50, posY: 50 }
    ],
    blogs: [
      { src: '{{site.baseurl}}/content/resources/images/blog_openai.jpg', zoom: 0.6, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/blog_google_research.jpg', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/blog_bair.png', zoom: 0.8, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/blog_mit_explained.jpg', zoom: 0.8, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/blog_ibm_what_is_gen_ai.jpg', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/blog_hatchworks.webp', zoom: 1.0, posX: 50, posY: 50 }
    ],
    podcasts: [
      { src: '{{site.baseurl}}/content/resources/images/podcast_twiml.jpg', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/podcast_generative_ai_101.jpg', zoom: 0.9, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/podcast_super_data_science.jpg', zoom: 1.0, posX: 50, posY: 50 }
    ],
    tools: [
      { src: '{{site.baseurl}}/content/resources/images/tools_google_teachable_machine.jpg', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/tools_google_ai_experiments.png', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/tools_copilot.jpg', zoom: 0.5, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/tools_dall-e.webp', zoom: 1.0, posX: 50, posY: 50 },
      { src: '{{site.baseurl}}/content/resources/images/tools_synthesia.webp', zoom: 1.0, posX: 50, posY: 50 }
    ]
  };

  let cardIDs = Object.keys(cardImages);
  let currentCardIndex = 0;
  let currentImageIndexes = Object.fromEntries(cardIDs.map(id => [id, 0]));

  function rotateNextCard() {
    const cardId = cardIDs[currentCardIndex];
    const imageArray = cardImages[cardId];
    const imageContainer = document.querySelector(`.resource-card[data-card-id="${cardId}"] .card-image`);

    if (imageContainer) {
      // Advance image index
      currentImageIndexes[cardId] = (currentImageIndexes[cardId] + 1) % imageArray.length;
      const imageConfig = imageArray[currentImageIndexes[cardId]];

      // Fade out → change src and apply zoom/position → fade in
      imageContainer.style.opacity = 0;
      setTimeout(() => {
        imageContainer.src = imageConfig.src;
        // Apply zoom and position
        imageContainer.style.transform = `scale(${imageConfig.zoom})`;
        imageContainer.style.objectPosition = `${imageConfig.posX}% ${imageConfig.posY}%`;
        imageContainer.style.opacity = 1;
      }, 500);
    }

    // Move to next card in list
    currentCardIndex = (currentCardIndex + 1) % cardIDs.length;
  }

  // Rotate one card every 4 seconds
  setInterval(rotateNextCard, 4000);
});
</script>

## How to Use These Resources

Not sure where to start? Try one item from each category and keep notes on what interests you. This is your personal AI journey—explore at your own pace.

---

We continuously update this section with new and valuable resources. If you have a recommendation, feel free to let us know!