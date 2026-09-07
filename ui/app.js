/**
 * VortexDM - High-Performance Go Multi-Threaded Download Manager
 * UI Controller with Custom SVG Vectors & Real-Time SSE Streamer
 */

// --- 1. Internationalization (i18n) Dictionary ---
const translations = {
  fa: {
    btn_new_download: 'دانلود جدید',
    menu_status: 'وضعیت',
    cat_all: 'همه دانلودها',
    cat_downloading: 'در حال دانلود',
    cat_completed: 'تکمیل‌شده‌ها',
    menu_categories: 'دسته‌بندی فایل‌ها',
    cat_video: 'ویدیوها',
    cat_audio: 'موزیک و صدا',
    cat_software: 'برنامه‌ها',
    cat_archive: 'فایل‌های فشرده',
    cat_document: 'اسناد',
    search_placeholder: 'جستجو در بین فایل‌ها...',
    action_resume_all: 'ادامه همه',
    action_pause_all: 'توقف همه',
    action_clear_completed: 'پاک‌سازی تکمیل‌ها',
    tooltip_resume_all: 'ادامه همه دانلودها',
    tooltip_pause_all: 'توقف موقت همه دانلودها',
    tooltip_clear_completed: 'حذف دانلودهای تکمیل‌شده از لیست',
    total_speed: 'سرعت لحظه‌ای کل',
    col_name: 'نام فایل و نشانی',
    col_progress: 'پیشرفت و قطعات همروند (Chunks)',
    col_size: 'حجم',
    col_speed: 'سرعت و زمان باقی‌مانده',
    col_actions: 'عملیات',
    empty_title: 'هیچ دانلودی در صف نیست',
    empty_desc: 'روی دکمه "دانلود جدید" کلیک کنید یا نشانی لینک مستقیم را وارد نمایید تا موتور توربوی Go با حداکثر توان همروندی شروع به دانلود کند.',
    modal_title: 'افزودن دانلود چندتکه‌ای جدید',
    label_url: 'آدرس مستقیم فایل (Direct URL):',
    label_filename: 'نام دلخواه فایل (اختیاری):',
    label_connections: 'تعداد کانکشن‌های موازی (Goroutines):',
    btn_cancel: 'انصراف',
    btn_start_download: 'شروع دانلود با توربو',
    status_queued: 'در صف',
    status_probing: 'بررسی سرور...',
    status_downloading: 'در حال دانلود',
    status_paused: 'متوقف شده',
    status_completed: 'تکمیل شد',
    status_error: 'خطا در دانلود',
    action_pause: 'توقف موقت',
    action_resume: 'ادامه دانلود',
    action_open: 'باز کردن فایل / پوشه',
    action_delete: 'حذف دانلود',
    confirm_delete: 'آیا از حذف این دانلود اطمینان دارید؟',
    toast_added: 'دانلود جدید با موفقیت اضافه شد',
    toast_deleted: 'دانلود حذف گردید',
    toast_resumed_all: 'همه دانلودها فعال شدند',
    toast_paused_all: 'همه دانلودها متوقف شدند',
    toast_cleared: 'دانلودهای تکمیل‌شده پاک‌سازی شدند',
    toast_error: 'خطا در برقراری ارتباط با سرور'
  },
  en: {
    btn_new_download: 'New Download',
    menu_status: 'Status',
    cat_all: 'All Downloads',
    cat_downloading: 'Downloading',
    cat_completed: 'Completed',
    menu_categories: 'Categories',
    cat_video: 'Videos',
    cat_audio: 'Music & Audio',
    cat_software: 'Software',
    cat_archive: 'Archives',
    cat_document: 'Documents',
    search_placeholder: 'Search files...',
    action_resume_all: 'Resume All',
    action_pause_all: 'Pause All',
    action_clear_completed: 'Clear Completed',
    tooltip_resume_all: 'Resume all downloads',
    tooltip_pause_all: 'Pause all downloads',
    tooltip_clear_completed: 'Remove completed downloads from list',
    total_speed: 'Total Download Speed',
    col_name: 'File Name & URL',
    col_progress: 'Progress & Chunks',
    col_size: 'Size',
    col_speed: 'Speed & ETA',
    col_actions: 'Actions',
    empty_title: 'No downloads in queue',
    empty_desc: 'Click "New Download" or enter a direct file URL to start downloading with Go multi-threaded turbo speed.',
    modal_title: 'Add Multi-Threaded Download',
    label_url: 'Direct File URL:',
    label_filename: 'Custom File Name (Optional):',
    label_connections: 'Parallel Connections (Goroutines):',
    btn_cancel: 'Cancel',
    btn_start_download: 'Start Turbo Download',
    status_queued: 'Queued',
    status_probing: 'Probing Server...',
    status_downloading: 'Downloading',
    status_paused: 'Paused',
    status_completed: 'Completed',
    status_error: 'Error',
    action_pause: 'Pause',
    action_resume: 'Resume',
    action_open: 'Open File / Folder',
    action_delete: 'Delete',
    confirm_delete: 'Are you sure you want to delete this download?',
    toast_added: 'New download added successfully',
    toast_deleted: 'Download removed',
    toast_resumed_all: 'All downloads resumed',
    toast_paused_all: 'All downloads paused',
    toast_cleared: 'Completed downloads cleared',
    toast_error: 'Server communication error'
  }
};

let currentLang = localStorage.getItem('vortex_lang') || 'fa';
let activeFilter = 'all';
let searchQuery = '';
let tasksData = [];
let speedHistory = new Array(30).fill(0);

// --- 2. Custom SVG Vectors Map ---
const svgIcons = {
  video: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`,
  audio: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
  software: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  archive: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,
  document: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
  other: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
  play: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
  pause: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`,
  folder: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
  trash: `<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`
};

// --- 3. Language & i18n Helpers ---
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('vortex_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';

  const t = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (t[key]) el.title = t[key];
  });

  const langLabel = document.getElementById('langLabel');
  if (langLabel) {
    langLabel.textContent = (lang === 'fa') ? 'English' : 'فارسی';
  }

  renderTasks();
}

// --- 4. Format Helpers ---
function formatBytes(bytes) {
  if (bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

function formatSpeed(bps) {
  return formatBytes(bps) + '/s';
}

function formatDuration(sec) {
  if (sec <= 0 || sec > 864000) return '--:--';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getCategorySVG(cat) {
  return svgIcons[cat] || svgIcons.other;
}

// --- 5. Smooth 60FPS Canvas Speed Chart ---
const canvas = document.getElementById('speedCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function updateSpeedGraph(newSpeed) {
  speedHistory.push(newSpeed);
  speedHistory.shift();

  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const maxSpeed = Math.max(...speedHistory, 1024 * 1024);

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
  grad.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

  const step = w / (speedHistory.length - 1);

  // Draw fill
  ctx.beginPath();
  for (let i = 0; i < speedHistory.length; i++) {
    const val = speedHistory[i];
    const y = h - (val / maxSpeed) * (h - 6) - 3;
    const x = i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw stroke
  ctx.beginPath();
  for (let i = 0; i < speedHistory.length; i++) {
    const val = speedHistory[i];
    const y = h - (val / maxSpeed) * (h - 6) - 3;
    const x = i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 1.8;
  ctx.stroke();
}

// --- 6. Task List DOM Rendering ---
const tasksListContainer = document.getElementById('tasksList');
const emptyTasksElement = document.getElementById('emptyTasks');
const globalSpeedVal = document.getElementById('globalSpeedVal');

const countAllEl = document.getElementById('countAll');
const countActiveEl = document.getElementById('countActive');
const countDoneEl = document.getElementById('countDone');

function renderTasks() {
  const t = translations[currentLang];
  let filtered = tasksData.filter(task => {
    if (activeFilter === 'downloading') {
      if (task.status !== 'downloading' && task.status !== 'probing') return false;
    } else if (activeFilter === 'completed') {
      if (task.status !== 'completed') return false;
    } else if (['video', 'audio', 'software', 'archive', 'document'].includes(activeFilter)) {
      if (task.category !== activeFilter) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = (task.filename || '').toLowerCase().includes(q);
      const matchUrl = (task.url || '').toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }

    return true;
  });

  if (countAllEl) countAllEl.textContent = tasksData.length;
  if (countActiveEl) countActiveEl.textContent = tasksData.filter(x => x.status === 'downloading').length;
  if (countDoneEl) countDoneEl.textContent = tasksData.filter(x => x.status === 'completed').length;

  if (filtered.length === 0) {
    if (emptyTasksElement) emptyTasksElement.classList.remove('hidden');
    const items = tasksListContainer.querySelectorAll('.task-item');
    items.forEach(el => el.remove());
    return;
  }

  if (emptyTasksElement) emptyTasksElement.classList.add('hidden');

  const existingIds = new Set(filtered.map(x => x.id));
  const currentEls = tasksListContainer.querySelectorAll('.task-item');
  currentEls.forEach(el => {
    if (!existingIds.has(el.dataset.id)) el.remove();
  });

  filtered.forEach(task => {
    let card = tasksListContainer.querySelector(`.task-item[data-id="${task.id}"]`);
    if (!card) {
      card = document.createElement('div');
      card.className = 'task-item';
      card.dataset.id = task.id;
      tasksListContainer.appendChild(card);
    }
    updateTaskCard(card, task, t);
  });
}

function updateTaskCard(card, task, t) {
  const percent = Math.min(100, Math.max(0, task.progress || 0)).toFixed(1);
  const isDone = task.status === 'completed';
  const isPaused = task.status === 'paused';
  const isDownloading = task.status === 'downloading' || task.status === 'probing';
  const isFailed = task.status === 'error';

  let statusText = t['status_' + task.status] || task.status;
  let statusBadgeClass = 'status-active';
  let barFillClass = '';

  if (isDone) {
    statusBadgeClass = 'status-completed';
    barFillClass = 'done';
  } else if (isPaused) {
    statusBadgeClass = 'status-paused';
    barFillClass = 'paused';
  } else if (isFailed) {
    statusBadgeClass = 'status-failed';
  }

  // Neon Chunk Strip
  let chunkStripHtml = '';
  if (task.chunks && task.chunks.length > 0) {
    chunkStripHtml = '<div class="chunk-strip" dir="ltr">';
    task.chunks.forEach(chunk => {
      let chunkClass = 'chunk-segment';
      if (chunk.completed || (chunk.downloaded >= chunk.size && chunk.size > 0)) {
        chunkClass += ' chunk-done';
      } else if (isDownloading && chunk.downloaded > 0) {
        chunkClass += ' chunk-active';
      }
      chunkStripHtml += `<div class="${chunkClass}" title="Chunk ${chunk.index + 1}: ${formatBytes(chunk.downloaded)} / ${formatBytes(chunk.size)}"></div>`;
    });
    chunkStripHtml += '</div>';
  }

  // Vector Action Buttons
  let pauseResumeBtn = '';
  if (isDownloading) {
    pauseResumeBtn = `<button class="btn-action btn-pause" data-action="pause" data-id="${task.id}" title="${t.action_pause}">${svgIcons.pause}</button>`;
  } else if (isPaused || isFailed) {
    pauseResumeBtn = `<button class="btn-action btn-resume" data-action="resume" data-id="${task.id}" title="${t.action_resume}">${svgIcons.play}</button>`;
  }

  let openBtn = '';
  if (isDone) {
    openBtn = `<button class="btn-action btn-open" data-action="open" data-id="${task.id}" title="${t.action_open}">${svgIcons.folder}</button>`;
  }

  const deleteBtn = `<button class="btn-action btn-delete" data-action="delete" data-id="${task.id}" title="${t.action_delete}">${svgIcons.trash}</button>`;

  const totalSize = task.total_size || 0;
  const downloadedSize = task.downloaded || 0;
  const totalSizeStr = totalSize > 0 ? formatBytes(totalSize) : '--';
  const downloadedStr = formatBytes(downloadedSize);
  const speedStr = isDownloading ? formatSpeed(task.speed || 0) : '--';
  const etaStr = (isDownloading && task.eta) ? task.eta : (isDone ? t.status_completed : '--');

  card.innerHTML = `
    <div class="task-info-col">
      <div class="task-cat-badge">${getCategorySVG(task.category)}</div>
      <div class="task-details">
        <span class="task-filename" title="${task.filename}">${task.filename}</span>
        <span class="task-url" title="${task.url}">${task.url}</span>
      </div>
    </div>

    <div class="task-progress-col">
      <div class="progress-header">
        <span class="progress-status-badge ${statusBadgeClass}">${statusText}</span>
        <span class="progress-percent-ltr">${percent}%</span>
      </div>
      <div class="progress-bar-bg" dir="ltr">
        <div class="progress-bar-fill ${barFillClass}" style="width: ${percent}%;"></div>
      </div>
      ${chunkStripHtml}
    </div>

    <div class="task-size-col">
      <span class="task-size-downloaded">${downloadedStr}</span>
      <span class="task-size-total">/ ${totalSizeStr}</span>
    </div>

    <div class="task-speed-col">
      <span class="task-speed-val">${speedStr}</span>
      <span class="task-eta-val">${etaStr}</span>
    </div>

    <div class="task-actions-col">
      ${pauseResumeBtn}
      ${openBtn}
      ${deleteBtn}
    </div>
  `;
}

// --- 7. SSE & REST API Communication ---
function initSSE() {
  const evtSource = new EventSource('/api/events');

  evtSource.addEventListener('tasks', (e) => {
    try {
      const data = JSON.parse(e.data);
      if (Array.isArray(data.tasks)) {
        tasksData = data.tasks;
      }
      if (typeof data.total_speed === 'number') {
        if (globalSpeedVal) globalSpeedVal.textContent = formatSpeed(data.total_speed);
        updateSpeedGraph(data.total_speed);
      }
      renderTasks();
    } catch (err) {
      console.error('Failed to parse SSE tasks payload', err);
    }
  });

  evtSource.onerror = (err) => {
    console.warn('SSE connection lost, fallback to REST polling...', err);
    evtSource.close();
    setTimeout(initSSE, 3500);
  };
}

async function fetchTasksREST() {
  try {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.tasks)) {
        tasksData = data.tasks;
      }
      if (typeof data.total_speed === 'number') {
        if (globalSpeedVal) globalSpeedVal.textContent = formatSpeed(data.total_speed);
        updateSpeedGraph(data.total_speed);
      }
      renderTasks();
    }
  } catch (e) {}
}

// --- 8. Toolbar Quick Actions (Resume All, Pause All, Clear Completed) ---
const btnResumeAll = document.getElementById('btnResumeAll');
const btnPauseAll = document.getElementById('btnPauseAll');
const btnClearCompleted = document.getElementById('btnClearCompleted');

if (btnResumeAll) {
  btnResumeAll.addEventListener('click', async () => {
    await fetch('/api/tasks/start-all', { method: 'POST' });
    showToast(translations[currentLang].toast_resumed_all);
    fetchTasksREST();
  });
}

if (btnPauseAll) {
  btnPauseAll.addEventListener('click', async () => {
    await fetch('/api/tasks/pause-all', { method: 'POST' });
    showToast(translations[currentLang].toast_paused_all);
    fetchTasksREST();
  });
}

if (btnClearCompleted) {
  btnClearCompleted.addEventListener('click', async () => {
    await fetch('/api/tasks/clear-completed', { method: 'POST' });
    showToast(translations[currentLang].toast_cleared);
    fetchTasksREST();
  });
}

// --- 9. Task Item Event Delegation ---
tasksListContainer.addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;

  const action = btn.dataset.action;
  const taskId = btn.dataset.id;
  const t = translations[currentLang];

  if (action === 'pause') {
    await fetch(`/api/tasks/pause?id=${taskId}`, { method: 'POST' });
    fetchTasksREST();
  } else if (action === 'resume') {
    await fetch(`/api/tasks/start?id=${taskId}`, { method: 'POST' });
    fetchTasksREST();
  } else if (action === 'open') {
    await fetch(`/api/tasks/open?id=${taskId}`, { method: 'POST' });
  } else if (action === 'delete') {
    if (confirm(t.confirm_delete)) {
      await fetch(`/api/tasks/delete?id=${taskId}`, { method: 'POST' });
      showToast(t.toast_deleted);
      fetchTasksREST();
    }
  }
});

// --- 10. Modal Dialog Logic ---
const taskModal = document.getElementById('taskModal');
const btnNewDownload = document.getElementById('btnNewDownload');
const btnEmptyNew = document.getElementById('btnEmptyNew');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const submitTaskBtn = document.getElementById('submitTaskBtn');
const modalUrlInput = document.getElementById('modalUrlInput');
const modalFilenameInput = document.getElementById('modalFilenameInput');
const modalConnectionsSelect = document.getElementById('modalConnectionsSelect');

function openModal() {
  taskModal.classList.remove('hidden');
  modalUrlInput.value = '';
  modalFilenameInput.value = '';
  modalUrlInput.focus();

  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText().then(text => {
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        modalUrlInput.value = text.trim();
      }
    }).catch(() => {});
  }
}

function closeModal() {
  taskModal.classList.add('hidden');
}

if (btnNewDownload) btnNewDownload.addEventListener('click', openModal);
if (btnEmptyNew) btnEmptyNew.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

submitTaskBtn.addEventListener('click', async () => {
  const url = modalUrlInput.value.trim();
  if (!url) {
    modalUrlInput.focus();
    return;
  }

  const filename = modalFilenameInput.value.trim();
  const connections = parseInt(modalConnectionsSelect.value, 10) || 16;
  const t = translations[currentLang];

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, filename, connections })
    });

    if (res.ok) {
      closeModal();
      showToast(t.toast_added);
      fetchTasksREST();
    } else {
      const errData = await res.json();
      alert(errData.error || t.toast_error);
    }
  } catch (err) {
    alert(t.toast_error);
  }
});

// --- 11. Search & Filter Handlers ---
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    activeFilter = item.dataset.filter || 'all';
    renderTasks();
  });
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasks();
  });
}

const langToggleBtn = document.getElementById('langToggleBtn');
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    setLanguage(currentLang === 'fa' ? 'en' : 'fa');
  });
}

// --- 12. Toast Feedback Helper ---
function showToast(msg) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// --- 13. Initialization ---
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  initSSE();
  setInterval(fetchTasksREST, 1500);
});
