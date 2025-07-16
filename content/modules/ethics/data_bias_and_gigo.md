---
layout: course_page
title: AI Ethics
published: true
module_slug: ai-ethics
section_slug: modules_section
---

# Garbage In, Garbage Out: Why Data Matters


## 1. **AI Learns What It’s Fed**

<figure class="float-left-figure" style="width: 50%;">
    <img src="../../../images/ai_flawed.png" alt="Descriptive Alt Text"
  class="figure-img">
    <figcaption class="figure-caption figure-caption-with-title">
      <span class="caption-title">
      AI Flaws:
      </span> 
If AI’s ‘education’ is flawed, so are its answers.
    </figcaption>
</figure>

At its core, AI doesn’t “think” or “know” in the human sense—it learns from patterns in the data it’s trained on. If that data is complete, diverse, and accurate, the AI has a chance of producing balanced, useful outputs. But feed it incomplete, outdated, or biased data, and the AI will reflect those flaws back at you. This is why training data isn’t just a technical detail—it’s the foundation of how AI behaves.

**Analogy:**
It’s like studying for a history exam using only one country’s version of events. Your answers will mirror that narrow perspective, not the full story.

**Image Idea:**
An AI robot reading a pile of tattered, one-sided textbooks with missing pages.
**Caption:**

<div style="clear: both;"></div>

<!-- and right below this -->
<div class="advanced-content" markdown="1">How AIs Actually Learn From Data
Technically, most modern AIs—especially those using neural networks or large-scale machine learning—“learn” by optimizing mathematical weights across vast layers of nodes. During training, the system processes thousands or millions of examples and adjusts its parameters to minimize mistakes. The learning algorithm doesn’t know what is “true” or “ethical”—it’s simply finding statistical patterns that match the training data. If subtle biases or gaps exist in that data, they become encoded in the AI’s internal calculations, often in ways that are invisible even to experts. This means that the quality, balance, and variety of a dataset directly shape the model’s underlying logic.
</div>


---

## 2. **GIGO: Garbage In, Garbage Out**

<figure class="float-left-figure" style="width: 40%;">
    <img src="../../../images/ai_bdi_bdo.png" alt="Descriptive Alt Text"
  class="figure-img">
    <figcaption class="figure-caption figure-caption-with-title">
      <span class="caption-title">
      Bad Data?
      </span> 
      Bad data in = bad decisions out
    </figcaption>
</figure>

“Garbage In, Garbage Out” (GIGO) is a classic computing concept, and it applies to AI too. If the input data contains errors, biases, or noise, the AI’s output will carry those flaws—sometimes amplified. For example, a resume-screening AI trained only on male candidates from the past might assume male applicants are “better fits.” It’s not being malicious; it’s simply reflecting its skewed training.

**Analogy:**
Imagine trying to bake a perfect cake with spoiled ingredients. No matter how good your oven is, the cake will turn out bad.

**Image Idea:**
A conveyor belt feeding trash into a robot’s “head,” with garbage-like outputs (nonsense text, biased charts) coming out the other side.
**Caption:**
*"Bad data in = bad decisions out."*


<div style="clear: both;"></div>

<!-- and right below this -->
<div class="advanced-content" markdown="1">Why “Garbage In, Garbage Out” Gets Worse With Scale
When an AI system faces bad or biased data, it doesn’t just reflect those mistakes—it might amplify them. That’s because neural networks and other ML models are great at picking up even subtle statistical trends, including ones that humans might overlook or ignore. In large, complex systems, a tiny skew (like underrepresenting a certain demographic) could snowball—resulting in systematically unfair decisions at scale. Data cleaning, normalization, and bias detection routines are essential parts of every serious AI pipeline, but no process is perfect. This is a big reason why real AI development involves constant iteration, review, and updating of both models and datasets.
</div>


---

## 3. **Fixing the Data Problem**

<figure class="float-left-figure" style="width: 50%;">
    <img src="../../../images/fairer_ai.png" alt="Descriptive Alt Text"
  class="figure-img">
    <figcaption class="figure-caption figure-caption-with-title">
      <span class="caption-title">
      </span> 
      Better data means fairer AI
    </figcaption>
</figure>

Creating better AI starts with better data. This means curating diverse, representative datasets, removing obvious errors, and testing for hidden biases. It also means asking hard questions: *Who collected this data? Whose voices are missing?* Even then, perfection is nearly impossible—so AI developers also need systems for catching mistakes after deployment.

**Analogy:**
It’s like editing a group photo to make sure no one is left out and everyone is visible.

**Image Idea:**
A diverse team working together around a giant dataset, highlighting and correcting flaws with magnifying glasses and sticky notes.
**Caption:**
*"Better data means fairer AI."*


<div style="clear: both;"></div>

<!-- and right below this -->
<div class="advanced-content" markdown="1">How Developers Fight Hidden Biases
Behind every reputable AI product is a cycle of dataset audits, ethical review boards, adversarial testing (to spot weird or harmful outputs), and ongoing monitoring after launch. Techniques like data augmentation, re-sampling, and fairness-aware algorithms can help reduce bias. However, some biases are subtle or context-dependent—they only become visible after deployment, when real people interact with the tool. That’s why developers track outputs for signs of drift or problematic patterns, and build in “red teaming” (deliberately trying to break the AI). Truly responsible AI is a moving target, requiring data scientists, ethicists, and domain experts to collaborate throughout the system’s life cycle.

</div>

---

# 💡 Interactive Activity: **Spot the Bias**

---

**Setup:**
Provide students with a few sample “datasets” (could be text lists, images, or mock survey results):

* `A name list with mostly Western names.`
* `A photo set where most people are light-skinned.`
* `A movie database where 90% of the directors are male.`

Ask students to:

1. Analyze each dataset.
2. Label potential biases or gaps.
3. Discuss: *“What might happen if an AI trains on this?”*

**Debrief:**
Guide them to see how unbalanced data leads to biased AI outputs and why diversity in datasets matters.

---


## Interactive Instant Quiz

<!-- Question 1 -->
<div class="quiz" data-quiz-id="pop_quiz_ai_dataquality_01"></div>

<!-- Question 2 -->
<div class="quiz" data-quiz-id="pop_quiz_ai_dataquality_02"></div>

<!-- Question 3 -->
<div class="quiz" data-quiz-id="pop_quiz_ai_dataquality_03"></div>