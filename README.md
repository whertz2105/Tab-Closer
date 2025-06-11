# Tab-Closer
Closes all but the protected tabs in your browser
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
5. By default, only tabs in the current window are affected. Check **Affect all windows** if you want to close unprotected tabs everywhere.
6. Press **Close Unprotected Tabs** to close all other tabs.
7. Use **Restore Last Closed Tabs** to reopen the most recently closed set of tabs.

Protected tabs and domains are stored using `chrome.storage.local`.
