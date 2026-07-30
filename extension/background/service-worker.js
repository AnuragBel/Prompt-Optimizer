const API_URL = "http://localhost:3000/api/enhance";

let popupWindowId = null;

chrome.action.onClicked.addListener(() => {
  if (popupWindowId !== null) {
    chrome.windows.get(popupWindowId, {}, (win) => {
      if (chrome.runtime.lastError || !win) {
        popupWindowId = null;
        createPopupWindow();
      } else {
        chrome.windows.update(popupWindowId, { focused: true });
      }
    });
  } else {
    createPopupWindow();
  }
});

function createPopupWindow() {
  chrome.windows.create(
    {
      url: chrome.runtime.getURL("popup/popup.html"),
      type: "popup",
      width: 420,
      height: 600
    },
    (win) => {
      popupWindowId = win.id;
    }
  );
}

chrome.windows.onRemoved.addListener((closedId) => {
  if (closedId === popupWindowId) popupWindowId = null;
});

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