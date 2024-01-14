// Helper function:
// Set icon accroding to browset theme
chrome.action.onClicked.addListener(async (tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

async function getTabId() {
  let tab = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab[0].id;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  chrome.runtime.sendMessage({ type: 'waitForTab' });
  const tabId = await getTabId();
  if (message.type === 'watch-tab') {
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js'],
    });
  }
  if (message.type == 'anchor') {
    chrome.scripting.executeScript({
      target: { tabId },
      func: (id) => {
        const element = document.getElementById(id);
        element.scrollIntoView({ behavior: 'smooth', alignment: 'start' });
      },
      args: [message.id],
    });
  }
});
