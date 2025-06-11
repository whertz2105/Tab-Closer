async function closeTabs(allWindows = false) {
  // Get the active tab in the current window
  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeId = activeTab ? activeTab.id : -1;

  // Get stored protected tab ids and domain list
  const { protectedTabs = [], domainList = [] } = await chrome.storage.local.get(["protectedTabs", "domainList"]);

  const queryInfo = allWindows ? {} : { windowId: activeTab.windowId };
  const tabs = await chrome.tabs.query(queryInfo);
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
    await chrome.storage.local.set({ lastClosedCount: removeIds.length });
  } else {
    await chrome.storage.local.set({ lastClosedCount: 0 });
  }
}

async function openLastClosed() {
  const { lastClosedCount = 0 } = await chrome.storage.local.get(['lastClosedCount']);
  if (lastClosedCount > 0) {
    const sessions = await chrome.sessions.getRecentlyClosed({ maxResults: lastClosedCount });
    for (const session of sessions) {
      if (session.tab) {
        await chrome.sessions.restore(session.tab.sessionId);
      } else if (session.window) {
        await chrome.sessions.restore(session.window.sessionId);
      }
    }
    await chrome.storage.local.set({ lastClosedCount: 0 });
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.action) return;
  if (msg.action === "closeTabs") {
    closeTabs(msg.allWindows);
  } else if (msg.action === "restoreTabs") {
    openLastClosed();
  }
});
