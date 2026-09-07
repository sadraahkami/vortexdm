document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('statusBadge');
  const statusText = document.getElementById('statusText');
  const urlInput = document.getElementById('urlInput');
  const btnDownload = document.getElementById('btnDownload');
  const chkAutoIntercept = document.getElementById('chkAutoIntercept');

  // Check connection to local VortexDM engine
  chrome.runtime.sendMessage({ action: 'checkConnection' }, (res) => {
    if (res && res.connected) {
      statusBadge.className = 'status-badge online';
      statusText.textContent = 'Online';
    } else {
      statusBadge.className = 'status-badge offline';
      statusText.textContent = 'Offline';
    }
  });

  // Load auto intercept setting
  const storage = await chrome.storage.local.get(['autoIntercept']);
  chkAutoIntercept.checked = !!storage.autoIntercept;

  chkAutoIntercept.addEventListener('change', () => {
    chrome.storage.local.set({ autoIntercept: chkAutoIntercept.checked });
  });

  // Try pasting clipboard URL if input is empty
  try {
    const clipText = await navigator.clipboard.readText();
    if (clipText && (clipText.startsWith('http://') || clipText.startsWith('https://'))) {
      urlInput.value = clipText.trim();
    }
  } catch (e) {}

  // Handle Download button
  btnDownload.addEventListener('click', () => {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      urlInput.focus();
      return;
    }

    btnDownload.disabled = true;
    btnDownload.textContent = 'Sending...';

    chrome.runtime.sendMessage({ action: 'sendDownload', url: rawUrl }, (res) => {
      if (res && res.success) {
        btnDownload.textContent = 'Sent!';
        setTimeout(() => window.close(), 700);
      } else {
        btnDownload.disabled = false;
        btnDownload.textContent = 'Failed (Is app running?)';
      }
    });
  });
});
