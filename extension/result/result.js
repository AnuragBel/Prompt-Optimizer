chrome.storage.local.get("lastEnhancedPrompt", (data) => {
  document.getElementById("promptDisplay").textContent =
    data.lastEnhancedPrompt || "No prompt found.";
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const text = document.getElementById("promptDisplay").textContent;
  navigator.clipboard.writeText(text);
  const status = document.getElementById("copyStatus");
  status.textContent = "✅ Copied!";
  setTimeout(() => (status.textContent = ""), 1500);
});