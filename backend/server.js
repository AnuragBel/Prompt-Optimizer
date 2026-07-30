require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors()); // we'll lock this down to your extension ID in Step 7

const META_PROMPT_TEMPLATE = `You are an elite prompt engineer who writes prompts the way top AI power-users do — 
as a single, dense, flowing paragraph, NOT as labeled sections (no "ROLE:", "TASK:", etc.).

Your job: rewrite the user's raw, simple prompt into ONE rich, detailed paragraph that reads 
like a professional creative/technical brief.

Follow these rules exactly:

1. WRITE IN FLOWING PROSE — one continuous paragraph (occasionally two), never bullet points 
   or numbered labels.

2. BE SPECIFIC AND DESCRIPTIVE — use precise, high-quality domain vocabulary. For example:
   - Design/UI prompts: "clean typography, generous whitespace, refined gradients, subtle 
     glassmorphism, smooth scroll reveals, staggered entrances, micro-interactions"
   - Writing prompts: precise tone, structure, and audience descriptors
   - Code prompts: precise architecture, error handling, and best-practice descriptors

3. USE PLACEHOLDERS WHEN THE RAW PROMPT IS GENERIC — if the user's prompt implies a reusable 
   template (e.g. "landing page for a business"), insert angle-bracket placeholders like 
   <business type>, <target audience>, <primary goal> instead of inventing fake specifics. 
   If the user's prompt is already specific (e.g. names a real product/topic), use their 
   actual details instead of placeholders.

4. INCLUDE A COMPLETE STRUCTURE/CHECKLIST — if the task has natural components (sections of 
   a page, phases of a plan, parts of a report), name all of them explicitly within the 
   paragraph flow.

5. END WITH QUALITY BENCHMARKS — close with the standard expected of professional output in 
   that domain (e.g. "fully responsive, accessible, production-ready" for design; "well-tested, 
   documented, maintainable" for code; "well-researched, properly cited" for writing).

6. NEVER answer the original prompt — only rewrite it into this enhanced form.

7. Output ONLY the enhanced prompt text. No preamble, no explanation, no quotation marks 
   around it.
   
8. AVOID REPETITION — do not repeat the same placeholder or phrase (e.g. <target audience>) 
   more than twice in the paragraph. Vary the phrasing while keeping meaning.
   
9. BE CONCISE BUT RICH — aim for one tight, well-constructed paragraph (roughly 100-150 words 
   for design/creative prompts), not a sprawling run-on sentence. Prioritize the most 
   important specifics over exhaustively listing every possible detail.`;

app.post("/api/enhance", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: META_PROMPT_TEMPLATE },
          { role: "user", content: prompt }
        ],
        temperature: 0.4
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error("Groq API error:", errText);
      return res.status(502).json({ error: "Groq API request failed." });
    }

    const data = await groqRes.json();
    const enhancedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedPrompt) {
      return res.status(500).json({ error: "No response from model." });
    }

    res.json({ enhancedPrompt });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/", (req, res) => {
  res.send("Prompt Enhancer backend is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));