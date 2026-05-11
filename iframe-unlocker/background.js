chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openInScreenora",
    title: "Abrir no Screenora",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openInScreenora" && tab.url) {
    const screenoraUrl = `http://localhost:3001/?url=${encodeURIComponent(tab.url)}`;
    chrome.tabs.create({ url: screenoraUrl });
  }
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url && !tab.url.startsWith('chrome://')) {
    const screenoraUrl = `http://localhost:3001/?url=${encodeURIComponent(tab.url)}`;
    chrome.tabs.create({ url: screenoraUrl });
  } else {
    chrome.tabs.create({ url: 'http://localhost:3001' });
  }
});
