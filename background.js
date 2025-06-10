async function closeTabs() {
  // Get the active tab in the current window
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeId = activeTab ? activeTab.id : -1;

  // Get stored protected tab ids and domain list
  const { protectedTabs = [], domainList = [] } = await chrome.storage.local.get(["protectedTabs", "domainList"]);

  const tabs = await chrome.tabs.query({});
  const removeIds = [];

  for (const tab of tabs) {
    if (tab.id === activeId) continue; // skip active
    if (protectedTabs.includes(tab.id)) continue; // skip protected

    try {
      const url = new URL(tab.url);
      const host = url.hostname;
      const skip = domainList.some(domain => host === domain || host.endsWith("." + domain));
      if (skip) continue;
    } catch (e) {
      // ignore malformed URLs
    }

    removeIds.push(tab.id);
  }

  if (removeIds.length > 0) {
    await chrome.tabs.remove(removeIds);
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "closeTabs") {
    closeTabs();
  }
});
