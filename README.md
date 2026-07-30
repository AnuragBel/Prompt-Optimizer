# ✨ Prompt Optimizer

A Chrome extension that instantly transforms raw, casual prompts into professional, structured, production-ready prompts for any LLM — powered by Groq's LLaMA 3.3 70B.

Click the extension icon, type a rough idea, and get back a polished, detailed prompt you can paste straight into ChatGPT, Claude, Gemini, or any AI tool.

---

## 🎯 Why This Exists

Most people write prompts like "make a landing page for my business" — vague, underspecified, and likely to produce generic AI output. **Prompt Optimizer** rewrites that into a rich, professional prompt with the specificity, structure, and vocabulary that gets significantly better results from any LLM.

**Example:**

| Raw Input | Optimized Output |
|---|---|
| "write about climate change" | A fully structured, dense paragraph specifying role, tone, audience, format, and quality benchmarks — ready to paste into any AI tool |

---

## 🏗️ Architecture

Chrome Extension (Popup UI)
│
▼
Service Worker (background script)
│
▼
Express Backend (Node.js) ── hosted on Render
│
▼
Groq API (llama-3.3-70b-versatile)


The Groq API key lives only on the backend — never exposed in the extension's client-side code.

---

## 🛠️ Tech Stack

- **Extension:** Vanilla JavaScript, Chrome Manifest V3
- **Backend:** Node.js, Express
- **LLM:** Groq (`llama-3.3-70b-versatile`)
- **Deployment:** Render

---

## ✨ Features

- One-click prompt enhancement from the Chrome toolbar
- Full-tab "Maximize" view for reading and copying longer prompts comfortably
- Copy-to-clipboard in both popup and full-tab views
- Meta-prompt engine that adapts structure based on prompt type (design, writing, code, etc.)
- Backend proxy architecture — API key never exposed client-side

---

## 🚀 Setup (Local Development)

### Backend

```bash
git clone https://github.com/AnuragBel/prompt-enhancer-backend.git
cd prompt-enhancer-backend
npm install
```

Create a `.env` file:

GROQ_API_KEY=your_groq_api_key_here
PORT=3000


Run the server:
```bash
node server.js
```

### Extension

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `prompt-enhancer-extension` folder
4. Pin the extension icon and start using it

---

## 📦 Project Structure

prompt-optimizer/
├── prompt-enhancer-backend/ # Express + Groq API server
│ ├── server.js
│ ├── package.json
│ └── .env (not committed)
└── prompt-enhancer-extension/ # Chrome extension (Manifest V3)
├── manifest.json
├── popup/
├── background/
├── result/ # full-tab view
└── icons/


---

## 🔒 Security Notes

- Groq API key is stored server-side only, via environment variables
- `.env` is git-ignored and never committed
- CORS is scoped to the extension's origin in production

---

## 📄 License

MIT

---

## 👤 Author

**Anurag Belgudri**
[GitHub](https://github.com/AnuragBel) [LinkedIn](https://linkedin.com/in/anuragbelgudri)
# Prompt-Optimizer
