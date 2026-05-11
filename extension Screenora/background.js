chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: `https://page-viewer-sepia.vercel.app/?url=${encodeURIComponent(tab.url)}`
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openInScreenora") {
    chrome.tabs.create({
      url: `https://page-viewer-sepia.vercel.app/?url=${encodeURIComponent(info.pageUrl)}`
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openInScreenora",
    title: "Abrir no Screenora",
    contexts: ["page"]
  });
});
