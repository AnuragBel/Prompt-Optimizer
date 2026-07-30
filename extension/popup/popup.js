const enhanceBtn = document.getElementById("enhanceBtn");
const copyBtn = document.getElementById("copyBtn");
const rawPromptEl = document.getElementById("rawPrompt");
const outputEl = document.getElementById("output");
const loadingEl = document.getElementById("loading");

enhanceBtn.addEventListener("click", () => {
  const rawPrompt = rawPromptEl.value.trim();

  if (!rawPrompt) {
    outputEl.value = "Please enter a prompt first.";
    return;
  }

  loadingEl.style.display = "block";
  outputEl.value = "";
  enhanceBtn.disabled = true;

  chrome.runtime.sendMessage(
    { type: "ENHANCE_PROMPT", payload: rawPrompt },
    (response) => {
      loadingEl.style.display = "none";
      enhanceBtn.disabled = false;

      if (chrome.runtime.lastError) {
        outputEl.value = "Error: " + chrome.runtime.lastError.message;
        return;
      }

      if (response?.error) {
        outputEl.value = "Error: " + response.error;
        return;
      }

      outputEl.value = response.enhancedPrompt;
    }
  );
});

copyBtn.addEventListener("click", () => {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
});

document.getElementById("maximizeBtn").addEventListener("click", () => {
  const prompt = outputEl.value.trim();
  if (!prompt) return;

  chrome.storage.local.set({ lastEnhancedPrompt: prompt }, () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("result/result.html") });
  });
});