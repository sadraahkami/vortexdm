const VORTEX_API_URL = 'http://127.0.0.1:8080';

// Register context menus on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'vortexdm_link',
    title: 'Download with VortexDM',
    contexts: ['link']
  });

  chrome.contextMenus.create({
    id: 'vortexdm_media',
    title: 'Download media with VortexDM',
    contexts: ['image', 'video', 'audio']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  let targetUrl = info.linkUrl || info.srcUrl;
  if (!targetUrl) return;

  sendToVortexDM(targetUrl);
});

// Send download task to local VortexDM instance
async function sendToVortexDM(url, filename = '') {
  try {
    const res = await fetch(`${VORTEX_API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: url,
        filename: filename,
        connections: 16
      })
    });

    if (res.ok) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'VortexDM',
        message: 'Download started in VortexDM'
      });
      return true;
    } else {
      const err = await res.json().catch(() => ({}));
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'VortexDM Error',
        message: err.error || 'Failed to start download'
      });
      return false;
    }
  } catch (err) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'VortexDM Offline',
      message: 'VortexDM is not running. Please launch the desktop app.'
    });
    return false;
  }
}

// Optional automatic browser download capture
chrome.downloads.onCreated.addListener(async (downloadItem) => {
  const settings = await chrome.storage.local.get(['autoIntercept']);
  if (!settings.autoIntercept) return;

  const url = downloadItem.finalUrl || downloadItem.url;
  if (!url || !url.startsWith('http')) return;

  // Cancel native browser download and redirect to VortexDM
  try {
    await chrome.downloads.cancel(downloadItem.id);
    await chrome.downloads.erase({ id: downloadItem.id });
    await sendToVortexDM(url, downloadItem.filename);
  } catch (e) {
    // If cancel failed, allow standard browser download
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === 'sendDownload') {
    sendToVortexDM(req.url, req.filename).then(ok => sendResponse({ success: ok }));
    return true;
  }
  if (req.action === 'checkConnection') {
    fetch(`${VORTEX_API_URL}/api/tasks`)
      .then(res => sendResponse({ connected: res.ok }))
      .catch(() => sendResponse({ connected: false }));
    return true;
  }
});
