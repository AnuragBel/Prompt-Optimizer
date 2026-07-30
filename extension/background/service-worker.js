const API_URL = "http://localhost:3000/api/enhance";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "ENHANCE_PROMPT") {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message.payload })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`);
        return res.json();
      })
      .then((data) => sendResponse({ enhancedPrompt: data.enhancedPrompt }))
      .catch((err) => sendResponse({ error: err.message }));

    return true; // REQUIRED: keeps message channel open for async fetch
  }
});