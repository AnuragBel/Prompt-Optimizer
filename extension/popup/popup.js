const enhanceBtn = document.getElementById("enhanceBtn");
const copyBtn = document.getElementById("copyBtn");
const maximizeBtn = document.getElementById("maximizeBtn");
const rawPromptEl = document.getElementById("rawPrompt");
const outputEl = document.getElementById("output");
const loadingEl = document.getElementById("loading");

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["savedRawPrompt", "savedOutput"], (data) => {
    if (data.savedRawPrompt) rawPromptEl.value = data.savedRawPrompt;
    if (data.savedOutput) outputEl.value = data.savedOutput;
  });
});

rawPromptEl.addEventListener("input", () => {
  chrome.storage.local.set({ savedRawPrompt: rawPromptEl.value });
});

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
      chrome.storage.local.set({ savedOutput: response.enhancedPrompt });
    }
  );
});

copyBtn.addEventListener("click", () => {
  if (!outputEl.value) return;
  navigator.clipboard.writeText(outputEl.value);
  copyBtn.textContent = "✅ Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy to Clipboard"), 1500);
});

maximizeBtn.addEventListener("click", () => {
  const enhanced = outputEl.value.trim();
  const raw = rawPromptEl.value.trim();
  if (!enhanced) return;

  chrome.storage.local.set(
    { lastRawPrompt: raw, lastEnhancedPrompt: enhanced },
    () => {
      chrome.tabs.create({ url: chrome.runtime.getURL("result/result.html") });
    }
  );
});