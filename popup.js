document.addEventListener('DOMContentLoaded', async () => {
  await renderTabs();
  await renderDomains();

  document.getElementById('addDomain').addEventListener('click', addDomain);
  document.getElementById('closeTabs').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'closeTabs' });
  });
});

async function renderTabs() {
  const tabList = document.getElementById('tabs');
  tabList.innerHTML = '';
  const [currentWindow] = await chrome.windows.getAll({ populate: true });
  const { protectedTabs = [] } = await chrome.storage.local.get(['protectedTabs']);
  for (const tab of currentWindow.tabs) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = protectedTabs.includes(tab.id);
    checkbox.dataset.id = tab.id;
    checkbox.addEventListener('change', toggleProtection);
    li.appendChild(checkbox);
    if (tab.favIconUrl) {
      const img = document.createElement('img');
      img.className = 'favicon';
      img.src = tab.favIconUrl;
      li.appendChild(img);
    }
    li.append(' ' + (tab.title || tab.url));
    tabList.appendChild(li);
  }
}

async function toggleProtection(e) {
  const tabId = parseInt(e.target.dataset.id, 10);
  const { protectedTabs = [] } = await chrome.storage.local.get(['protectedTabs']);
  if (e.target.checked) {
    if (!protectedTabs.includes(tabId)) protectedTabs.push(tabId);
  } else {
    const idx = protectedTabs.indexOf(tabId);
    if (idx >= 0) protectedTabs.splice(idx, 1);
  }
  await chrome.storage.local.set({ protectedTabs });
}

async function addDomain() {
  const input = document.getElementById('domainInput');
  const domain = input.value.trim();
  if (!domain) return;
  const { domainList = [] } = await chrome.storage.local.get(['domainList']);
  if (!domainList.includes(domain)) domainList.push(domain);
  await chrome.storage.local.set({ domainList });
  input.value = '';
  renderDomains();
}

async function renderDomains() {
  const list = document.getElementById('domainList');
  list.innerHTML = '';
  const { domainList = [] } = await chrome.storage.local.get(['domainList']);
  for (const domain of domainList) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = domain;
    const btn = document.createElement('button');
    btn.textContent = '🗑️';
    btn.className = 'trash';
    btn.dataset.domain = domain;
    btn.addEventListener('click', removeDomain);
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  }
}

async function removeDomain(e) {
  const domain = e.target.dataset.domain;
  const { domainList = [] } = await chrome.storage.local.get(['domainList']);
  const idx = domainList.indexOf(domain);
  if (idx >= 0) domainList.splice(idx, 1);
  await chrome.storage.local.set({ domainList });
  renderDomains();
}