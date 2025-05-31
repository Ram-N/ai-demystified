---
layout: course_page
title: Introduction to LLMs
published: true
module_slug: intro-to-llms
section_slug: modules_section
topic_slug: hallucinations
---



# Hallucinations and Why AI Sometimes Makes Stuff Up
Sometimes, LLMs produce responses that sound right—but are completely false. These are called *hallucinations*.


## Why Do LLMs Generate False Information?

<img src="../images/hand_hallucination.webp" alt="Descriptive Alt Text" width="40%" class="float-left-image">
All of us have seen a student who doesn’t know the answer, but tries to sound convincing anyway. Why do they do it? Possibly because the teacher expects an answer. Or they know a little bit, but exaggerate and say more than they know.

That is fine for us humans. But why would an AI (a model) be making stuff up? There are at least 3 reasons

**Training Data Errors:** LLMs learn from massive amounts of text and code, picked up from wherever they can. (Most of the internet!)
Sometimes, this data might contain errors or biases. The AI can unknowingly pick up and repeat these inaccuracies. This really does happen, but there are other reasons for why LLM's hallucinate!

**Patterns Without Understanding:** Don't forget that LLMs merely math models. They are excellent at finding patterns in language and predicting the next word. But they don't truly "understand" the meaning. If that pattern matching continues, they can "make up" next words and that sentence could turn out to be completely wrong! (Hallucination)

**Fluency:** LLMs are designed to generate human-like text. Sometimes, to sound more natural or complete a thought, they might fill in gaps with reasonable-sounding but incorrect information.


All of the factors above interact, and in spite of many checks and balances, the hallucinations could persist.


## Model Confidence vs. Correctness

<img src="../images/hallucination1.webp" alt="Descriptive Alt Text" width="45%" class="float-left-image">

The no-nonsense poet Charles Bukowski said, "The problem with the world is that the intelligent people are full of doubts, while the stupid ones are full of confidence." I have always loved that quote.

Remember the "overconfident student"? Likewise, an AI might *sound* very confident, but that has no bearing on whether the information is actually true.
LLMs are mathematical models, and they all have a "confidence score" -- about how likely its word choices are based on its training data. If that score is high, it will generate that as the next word in its output. But remember, this *confidence score* has nothing to do with whether the sentence it generated is factually correct!

Think of a parrot that can repeat many words and phrases it has heard. It can even string them together in a way that sounds like a sentence. However, the parrot doesn't actually understand the meaning behind the words. Similarly, an LLM can put words together convincingly without always understanding the underlying truth.

### Examples of Authoritative-Sounding but False AI Responses
AI Response:

    "The Battle of Waterloo, a pivotal moment in European history, 
    famously took place on the plains of ancient Egypt, 
    where Napoleon's forces clashed with the British and 
    Prussian armies in a decisive desert engagement."

Why it's false:

1. The Battle of Waterloo was fought in Belgium, not Egypt.
2. The AI confidently combined real historical elements but made a geographical error, resulting in a misleading response.

**Example 2**
AI Response:

```
"Dr. Eleanor Vance, a renowned astrophysicist at MIT, was awarded the Nobel Prize in Physics in
 2023 for her groundbreaking discovery of the 'Chrono-particle,' 
 a theoretical particle proven to allow for instantaneous time travel."
```
Why it's false:

1. "Dr. Eleanor Vance" is a fictional character.
2. There was no Nobel Prize awarded for a "Chrono-particle" in 2023 (or any year).
3. Instantaneous time travel remains a theoretical and unproven concept.
4. The AI fabricated a convincing academic scenario with false details.
   
  
Imagine a friend who loves to tell stories but sometimes gets carried away and starts adding details that didn't actually happen. They might sound really convincing and even believe their own embellishments! LLMs hallucinating is a little like that.

Nearly 2400 years ago, Aristotle said something profound. "It is the mark of an educated mind to be able to entertain a thought without accepting it." This emphasizes the importance of questioning information, even if it sounds good. LLMs can sound so convincing!

## Importance of Critical Thinking

<img src="../images/fakecheck.jpeg" alt="Descriptive Alt Text" width="45%" class="float-left-image">

* **Don't Believe Everything You Read (or Hear from AI):** Get into the habit of chasing down the source. We have to question information from any source, including AI. Don't just accept it as the truth.
* **Fact-Checking is Key:** Find other reliable sources for verifying information. "Fact-checking" just means checking if something is true. Don't just believe everything you read! You can use special websites like Snopes or FactCheck.org, which are good at finding out what's real and what's fake. It's always smart to check the same information on a few different trusted websites to be sure.
* **Consider Multiple Perspectives:** This is a very useful thing to do, with AI and also whenever we encounter opinions. We should seek information from different sources to get a well-rounded view. *Is there a different viewpoint?*
* **Understand the Limitations of AI:** While AI is a powerful tool, it's not infallible and should be used with caution and critical evaluation.


### Fact-finding mission for you

Please use the web search or any other method to see if the following statements are true or false.

1. The average human body contains enough iron to make a three-inch nail. (True or False)
2. Bees can communicate the location of food sources to other bees through a complex series of dances, including the famous "waggle dance." (True or False)
3. The Great Wall of China is the only man-made structure visible from space with the naked eye. (True or False)
4. A group of owls is collectively known as a "parliament." (True or False)
