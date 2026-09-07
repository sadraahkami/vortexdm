/**
 * VortexDM - Frontend Controller & Real-Time SSE Engine
 * High-Performance Go Multi-Threaded Download Manager UI
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
    total_speed: 'سرعت لحظه‌ای کل',
    col_name: 'نام فایل / نشانی',
    col_progress: 'پیشرفت و قطعات (Chunks)',
    col_size: 'حجم',
    col_speed: 'سرعت / زمان',
    col_actions: 'عملیات',
    empty_title: 'هیچ دانلودی در صف نیست',
    empty_desc: 'روی دکمه "دانلود جدید" کلیک کنید تا موتور همروند Go با حداکثر سرعت شروع به دانلود کند.',
    modal_title: 'افزودن دانلود چندتکه‌ای جدید',
    label_url: 'آدرس مستقیم فایل (URL):',
    label_filename: 'نام دلخواه فایل (اختیاری):',
    label_connections: 'تعداد کانکشن‌های موازی (Goroutines):',
    btn_cancel: 'انصراف',
    btn_start_download: 'شروع دانلود با توربو',
    status_queued: 'در صف',
    status_probing: 'در حال بررسی سرور...',
    status_downloading: 'در حال دانلود',
    status_paused: 'متوقف شده',
    status_completed: 'تکمیل شد',
    status_failed: 'خطا در دانلود',
    action_pause: 'توقف',
    action_resume: 'ادامه',
    action_open: 'باز کردن فایل',
    action_delete: 'حذف دانلود',
    confirm_delete: 'آیا از حذف این دانلود اطمینان دارید؟',
    toast_added: 'دانلود جدید با موفقیت اضافه شد',
    toast_deleted: 'دانلود حذف گردید',
    toast_error: 'خطا در ارتباط با سرور'
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
    total_speed: 'Total Download Speed',
    col_name: 'File Name / URL',
    col_progress: 'Progress & Chunks',
    col_size: 'Size',
    col_speed: 'Speed / ETA',
    col_actions: 'Actions',
    empty_title: 'No downloads in queue',
    empty_desc: 'Click "New Download" to start downloading with Go multi-threaded turbo speed.',
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
    status_failed: 'Failed',
    action_pause: 'Pause',
    action_resume: 'Resume',
    action_open: 'Open File',
    action_delete: 'Delete',
    confirm_delete: 'Are you sure you want to delete this task?',
    toast_added: 'New download added successfully',
    toast_deleted: 'Task deleted',
    toast_error: 'Server communication error'
  }
};

let currentLang = localStorage.getItem('vortex_lang') || 'fa';
let activeFilter = 'all';
let searchQuery = '';
let tasksData = [];
let speedHistory = new Array(30).fill(0);

// --- 2. i18n Helper Functions ---
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

  const langBtn = document.getElementById('langToggleBtn');
  if (langBtn) {
    langBtn.textContent = (lang === 'fa') ? 'English' : 'فارسی';
  }

  renderTasks();
}

// --- 3. Format Helpers ---
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
    return `${h}h ${m}m ${s}s`;
  }
  return `${m}m ${s}s`;
}

function getCategoryIcon(cat) {
  switch (cat) {
    case 'video': return '🎬';
    case 'audio': return '🎵';
    case 'archive': return '📦';
    case 'software': return '💿';
    case 'document': return '📄';
    default: return '📄';
  }
}

// --- 4. Canvas Speed Graph ---
const canvas = document.getElementById('speedCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function updateSpeedGraph(newSpeed) {
  speedHistory.push(newSpeed);
  speedHistory.shift();

  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const maxSpeed = Math.max(...speedHistory, 1024 * 1024); // at least 1MB/s scale

  ctx.beginPath();
  const step = w / (speedHistory.length - 1);
  for (let i = 0; i < speedHistory.length; i++) {
    const val = speedHistory[i];
    const y = h - (val / maxSpeed) * (h - 6) - 3;
    const x = i * step;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  // Neon Cyan Line
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 6;
  ctx.stroke();

  // Reset shadow
  ctx.shadowBlur = 0;
}

// --- 5. DOM & Task List Rendering ---
const tasksListContainer = document.getElementById('tasksList');
const emptyTasksElement = document.getElementById('emptyTasks');
const globalSpeedVal = document.getElementById('globalSpeedVal');

const countAllEl = document.getElementById('countAll');
const countActiveEl = document.getElementById('countActive');
const countDoneEl = document.getElementById('countDone');

function renderTasks() {
  const t = translations[currentLang];
  let filtered = tasksData.filter(task => {
    // Filter status / category
    if (activeFilter === 'downloading') {
      if (task.status !== 'downloading' && task.status !== 'probing') return false;
    } else if (activeFilter === 'completed') {
      if (task.status !== 'completed') return false;
    } else if (['video', 'audio', 'software', 'archive', 'document'].includes(activeFilter)) {
      if (task.category !== activeFilter) return false;
    }

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = (task.filename || '').toLowerCase().includes(q);
      const matchUrl = (task.url || '').toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }

    return true;
  });

  // Update counts
  if (countAllEl) countAllEl.textContent = tasksData.length;
  if (countActiveEl) countActiveEl.textContent = tasksData.filter(x => x.status === 'downloading').length;
  if (countDoneEl) countDoneEl.textContent = tasksData.filter(x => x.status === 'completed').length;

  if (filtered.length === 0) {
    if (emptyTasksElement) emptyTasksElement.classList.remove('hidden');
    // Clear list items without removing the emptyTasks element
    const items = tasksListContainer.querySelectorAll('.task-item');
    items.forEach(el => el.remove());
    return;
  }

  if (emptyTasksElement) emptyTasksElement.classList.add('hidden');

  // Retain or rebuild task elements
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
  const isFailed = task.status === 'failed';

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

  // Chunk blocks visualizer
  let chunkStripHtml = '';
  if (task.chunks && task.chunks.length > 0) {
    chunkStripHtml = '<div class="chunk-strip">';
    task.chunks.forEach(chunk => {
      let chunkClass = 'chunk-segment';
      if (chunk.downloaded >= chunk.size && chunk.size > 0) {
        chunkClass += ' chunk-done';
      } else if (isDownloading && chunk.downloaded > 0) {
        chunkClass += ' chunk-active';
      }
      chunkStripHtml += `<div class="${chunkClass}" title="Chunk ${chunk.index}: ${formatBytes(chunk.downloaded)} / ${formatBytes(chunk.size)}"></div>`;
    });
    chunkStripHtml += '</div>';
  }

  // Action Buttons
  let pauseResumeBtn = '';
  if (isDownloading) {
    pauseResumeBtn = `<button class="btn-action btn-pause" data-action="pause" data-id="${task.id}" title="${t.action_pause}">⏸</button>`;
  } else if (isPaused || isFailed) {
    pauseResumeBtn = `<button class="btn-action btn-resume" data-action="resume" data-id="${task.id}" title="${t.action_resume}">▶</button>`;
  }

  let openBtn = '';
  if (isDone) {
    openBtn = `<button class="btn-action btn-open" data-action="open" data-id="${task.id}" title="${t.action_open}">📂</button>`;
  }

  const deleteBtn = `<button class="btn-action btn-delete" data-action="delete" data-id="${task.id}" title="${t.action_delete}">🗑</button>`;

  const totalSizeStr = task.total_size > 0 ? formatBytes(task.total_size) : (task.resumable ? '--' : 'Stream');
  const downloadedStr = formatBytes(task.downloaded);
  const speedStr = isDownloading ? formatSpeed(task.speed) : '--';
  const etaStr = (isDownloading && task.eta > 0) ? formatDuration(task.eta) : (isDone ? t.status_completed : '--');

  card.innerHTML = `
    <div class="task-info-col">
      <div class="task-cat-icon">${getCategoryIcon(task.category)}</div>
      <div class="task-details">
        <span class="task-filename" title="${task.filename}">${task.filename}</span>
        <span class="task-url" title="${task.url}">${task.url}</span>
      </div>
    </div>

    <div class="task-progress-col">
      <div class="progress-header">
        <span class="progress-status-badge ${statusBadgeClass}">${statusText}</span>
        <span class="progress-percent">${percent}%</span>
      </div>
      <div class="progress-bar-bg">
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

// --- 6. SSE & REST API Communication ---
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
    setTimeout(initSSE, 4000);
  };
}

// Polling fallback
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
  } catch (e) {
    // server might be starting
  }
}

// --- 7. Task Actions (Pause, Resume, Delete, Open) ---
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

// --- 8. Modal & Task Submission ---
const taskModal = document.getElementById('taskModal');
const btnNewDownload = document.getElementById('btnNewDownload');
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

  // Try reading clipboard URL if possible
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

btnNewDownload.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

submitTaskBtn.addEventListener('click', async () => {
  const url = modalUrlInput.value.trim();
  if (!url) {
    modalUrlInput.focus();
    return;
  }

  const filename = modalFilenameInput.value.trim();
  const connections = parseInt(modalConnectionsSelect.value, 10) || 8;
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

// --- 9. Filter & Search Handlers ---
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

// --- 10. Toast Notification Helper ---
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
  }, 3500);
}

// --- 11. Initial Startup ---
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  initSSE();
  setInterval(fetchTasksREST, 1500);
});
