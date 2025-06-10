# Tab Closer Extension

This browser extension closes all tabs except:

1. The active tab.
2. Tabs you mark as **protected**.
3. Tabs whose domain matches any domain in your protected domain list.

## Usage

1. Load the extension in your Chromium-based browser:
   - Open `chrome://extensions`.
   - Enable **Developer mode**.
   - Click **Load unpacked** and choose this folder.
2. Click the Tab Closer icon to open the popup.
3. Check any tabs you want to protect from being closed. Each tab shows its favicon for easy identification.
4. Add domain names (e.g. `google.com`) that should never be closed. Use the trashcan button next to a domain to remove it from the list.
5. Press **Close Unprotected Tabs** to close all other tabs.

Protected tabs and domains are stored using `chrome.storage.local`.
