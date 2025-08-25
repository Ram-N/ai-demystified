---
layout: glossary
title: "RAG"
---

## Definition
**RAG (Retrieval-Augmented Generation)** is a method that combines the power of large language models (LLMs) with external information retrieval systems. Instead of relying only on the internal parameters of the model (which may be outdated or incomplete), RAG allows the model to **look up relevant documents or facts from a database, API, or search engine** at the time of answering a question. This leads to more accurate, up-to-date, and grounded responses.

In simple terms: RAG = Generation (LLM) + Retrieval (external knowledge source).

## Use Case
A virtual assistant helping customer support can use RAG to answer policy-related questions. Instead of relying on the static memory of the model, it retrieves the latest support documents and combines that with its own language abilities to produce helpful answers.

## Typical Architecture
- **Query** → User asks a question.
- **Retrieval** → System fetches relevant passages from a knowledge base (e.g., vector database, PDF, website).
- **Generation** → LLM reads those passages and generates a coherent, informed answer.

## Why It Matters
- **Reduces hallucination**: Since answers are grounded in real retrieved content.
- **Keeps responses up-to-date**: No need to retrain the model with every knowledge change.
- **Transparent**: Users can be shown sources for each answer.

## Related Terms
- **Vector Store** – Where the documents are stored and searched based on similarity.
- **Prompt Engineering** – How the retrieved info is combined into the final input to the LLM.
- **Grounded Generation** – Another name for this approach emphasizing the use of real data.

