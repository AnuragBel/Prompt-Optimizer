const rawInput = document.getElementById("rawInput");
const promptDisplay = document.getElementById("promptDisplay");
const reEnhanceBtn = document.getElementById("reEnhanceBtn");
const copyBtn = document.getElementById("copyBtn");
const loadingEl = document.getElementById("loading");
const copyStatus = document.getElementById("copyStatus");

chrome.storage.local.get(["lastRawPrompt", "lastEnhancedPrompt"], (data) => {
  rawInput.value = data.lastRawPrompt || "";
  promptDisplay.value = data.lastEnhancedPrompt || "No prompt found.";
});

reEnhanceBtn.addEventListener("click", () => {
  const prompt = rawInput.value.trim();
  if (!prompt) return;

  loadingEl.style.display = "block";
  reEnhanceBtn.disabled = true;

  chrome.runtime.sendMessage(
    { type: "ENHANCE_PROMPT", payload: prompt },
    (response) => {
      loadingEl.style.display = "none";
      reEnhanceBtn.disabled = false;

      if (chrome.runtime.lastError) {
        promptDisplay.value = "Error: " + chrome.runtime.lastError.message;
        return;
      }
      if (response?.error) {
        promptDisplay.value = "Error: " + response.error;
        return;
      }

      promptDisplay.value = response.enhancedPrompt;
      chrome.storage.local.set({
        lastRawPrompt: prompt,
        lastEnhancedPrompt: response.enhancedPrompt
      });
    }
  );
});

copyBtn.addEventListener("click", () => {
  if (!promptDisplay.value) return;
  navigator.clipboard.writeText(promptDisplay.value);
  copyStatus.textContent = "✅ Copied!";
  setTimeout(() => (copyStatus.textContent = ""), 1500);
});