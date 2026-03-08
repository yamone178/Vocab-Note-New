chrome.commands.onCommand.addListener((command) => {
  if (command === "quick-save") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: getSelectedText,
      }, (results) => {
        const selection = results[0].result;
        chrome.storage.local.set({ lastSelection: selection, sourceUrl: tabs[0].url }, () => {
          chrome.action.openPopup();
        });
      });
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString().trim();
}
