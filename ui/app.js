/**
 * VortexDM - Professional Desktop Download Manager
 * High-Density UI Controller, Scheduler, LinkIrani Inspector & Speed Allocator
 */

// --- 1. Comprehensive Bilingual Dictionary ---
const translations = {
  fa: {
    tb_add: 'دانلود جدید',
    tb_resume: 'ادامه',
    tb_pause: 'توقف',
    tb_pause_all: 'توقف همه',
    tb_delete: 'حذف',
    tb_clear: 'پاک‌سازی',
    tb_scheduler: 'زمان‌بندی',
    tb_speed_limit: 'سقف سرعت',
    tb_linkirani: 'استعلام نیم‌بها',
    tb_add_tip: 'افزودن نشانی دانلود جدید',
    tb_resume_tip: 'ادامه دانلود موارد انتخابی',
    tb_pause_tip: 'توقف موقت موارد انتخابی',
    tb_pause_all_tip: 'توقف موقت تمامی دانلودها',
    tb_delete_tip: 'حذف موارد انتخابی از صف و دیسک',
    tb_clear_tip: 'پاک‌سازی موارد تکمیل‌شده از لیست',
    tb_sched_tip: 'تنظیمات زمان‌بندی و صف دانلود شبانه',
    tb_limit_tip: 'محدودکننده و تقسیم هوشمند پهنای باند',
    tb_iran_tip: 'بررسی ترافیک داخلی / نیم‌بها در سامانه LinkIrani.ir',
    speed_lbl: 'سرعت کل:',
    tree_categories: 'دسته‌بندی‌ها',
    tree_queues: 'صف‌های دانلود (Queues)',
    cat_all: 'همه دانلودها',
    cat_compressed: 'فشرده (Compressed)',
    cat_documents: 'اسناد (Documents)',
    cat_music: 'موزیک و صدا (Music)',
    cat_programs: 'برنامه‌ها (Programs)',
    cat_video: 'ویدیوها (Video)',
    cat_unfinished: 'ناتمام (Unfinished)',
    cat_finished: 'تکمیل‌شده (Finished)',
    queue_main: 'صف اصلی',
    queue_night: 'صف شبانه (Night)',
    search_filter: 'فیلتر و جستجو در میان فایل‌ها...',
    selected_count: 'مورد انتخاب شده: ',
    col_filename: 'نام فایل (File Name)',
    col_size: 'حجم',
    col_progress: 'وضعیت / درصد پیشرفت',
    col_speed: 'سرعت انتقال',
    col_eta: 'زمان باقی‌مانده',
    col_traffic: 'تعرفه ترافیک',
    col_queue: 'صف',
    empty_msg: 'هیچ دانلودی وجود ندارد. برای شروع روی دکمه «دانلود جدید» کلیک کنید.',
    sb_ready: 'موتور همروند آماده است',
    sb_scheduler_state: 'زمان‌بندی: ',
    sb_speed_limit: 'سقف سرعت: ',
    sb_iran_support: 'سامانه تشخیص ترافیک داخلی فعال است',
    modal_add_title: 'افزودن دانلود جدید',
    lbl_url: 'آدرس فایل (URL):',
    lbl_filename: 'نام دلخواه ذخیره‌شده (اختیاری):',
    lbl_queue: 'صف دانلود:',
    lbl_conns: 'تعداد قطعات همزمان (Q):',
    btn_cancel: 'انصراف',
    btn_start: 'شروع دانلود',
    sched_title: 'تنظیمات زمان‌بندی و صف دانلود (Scheduler)',
    sched_enable: 'فعال‌سازی دانلود خودکار بر اساس زمان‌بندی برای این صف',
    sched_start_at: 'شروع دانلود در ساعت:',
    sched_stop_at: 'توقف دانلود در ساعت:',
    sched_days_title: 'روزهای اجرای برنامه در هفته:',
    sched_post_title: 'عملیات پس از اتمام تمام فایل‌های این صف:',
    sched_shutdown_pc: 'خاموش کردن رایانه پس از پایان دانلود (Turn off computer)',
    sched_sleep_pc: 'به حالت Sleep بردن سیستم (Suspend state)',
    sched_exit_app: 'بستن نرم‌افزار VortexDM',
    sched_max_concur: 'حداکثر فایل‌های همزمان در صف:',
    btn_save_apply: 'ذخیره و اعمال زمان‌بندی',
    limit_title: 'محدودکننده و تقسیم هوشمند پهنای باند',
    limit_intro: 'با تنظیم سقف سرعت، پهنای باند به شکل هوشمند و عادلانه میان دانلودهای فعال تقسیم شده و وب‌گردی و سایر نرم‌افزارها دچار افت سرعت نمی‌شوند.',
    limit_unlimited: 'نامحدود (حداکثر سرعت)',
    limit_custom: 'یا سقف دلخواه را وارد کنید (کیلوبایت بر ثانیه):',
    btn_apply: 'اعمال سقف سرعت',
    iran_check_title: 'استعلام ترافیک داخلی / نیم‌بها (LinkIrani.ir)',
    iran_intro: 'لینک یا دامنه مورد نظر خود را وارد کنید تا وضعیت داخلی بودن (نیم‌بها) یا بین‌المللی بودن آن فوراً بررسی شود.',
    btn_check: 'بررسی وضعیت ترافیک',
    iran_status_lbl: 'وضعیت محاسبه ترافیک:',
    iran_host: 'دامنه / هاست:',
    iran_ip: 'آدرس IP سرور:',
    cm_resume: 'ادامه دانلود',
    cm_pause: 'توقف موقت',
    cm_open_folder: 'باز کردن در پوشه',
    cm_copy: 'کپی نشانی دانلود',
    cm_check_iran: 'استعلام در LinkIrani.ir',
    cm_delete: 'حذف از صف و دیسک',
    status_queued: 'در صف',
    status_probing: 'بررسی سرور...',
    status_downloading: 'در حال دانلود',
    status_paused: 'متوقف شده',
    status_completed: 'تکمیل شد',
    status_error: 'خطا',
    traffic_domestic: '🟢 نیم‌بها',
    traffic_intl: '🌐 تمام‌بها',
    confirm_delete: 'آیا از حذف موارد انتخاب‌شده اطمینان دارید؟',
    unlimited: 'نامحدود (Max)',
    active_state: 'فعال',
    inactive_state: 'غیرفعال'
  },
  en: {
    tb_add: 'Add URL',
    tb_resume: 'Resume',
    tb_pause: 'Stop',
    tb_pause_all: 'Stop All',
    tb_delete: 'Delete',
    tb_clear: 'Delete Completed',
    tb_scheduler: 'Scheduler',
    tb_speed_limit: 'Speed Limiter',
    tb_linkirani: 'LinkIrani Check',
    tb_add_tip: 'Add new download URL',
    tb_resume_tip: 'Resume selected downloads',
    tb_pause_tip: 'Stop selected downloads',
    tb_pause_all_tip: 'Stop all active downloads',
    tb_delete_tip: 'Delete selected downloads from queue and disk',
    tb_clear_tip: 'Clear completed downloads from list',
    tb_sched_tip: 'Scheduler and night download settings',
    tb_limit_tip: 'Bandwidth allocator and speed limiter',
    tb_iran_tip: 'Check Iranian domestic half-price traffic status',
    speed_lbl: 'Speed:',
    tree_categories: 'Categories',
    tree_queues: 'Queues',
    cat_all: 'All Downloads',
    cat_compressed: 'Compressed',
    cat_documents: 'Documents',
    cat_music: 'Music',
    cat_programs: 'Programs',
    cat_video: 'Video',
    cat_unfinished: 'Unfinished',
    cat_finished: 'Finished',
    queue_main: 'Main Queue',
    queue_night: 'Night Queue',
    search_filter: 'Search and filter downloads...',
    selected_count: 'Selected: ',
    col_filename: 'File Name',
    col_size: 'Size',
    col_progress: 'Status / Progress',
    col_speed: 'Transfer Rate',
    col_eta: 'Time Left',
    col_traffic: 'Traffic Rate',
    col_queue: 'Queue',
    empty_msg: 'No downloads found. Click "Add URL" to start downloading.',
    sb_ready: 'Engine Ready',
    sb_scheduler_state: 'Scheduler: ',
    sb_speed_limit: 'Speed Limit: ',
    sb_iran_support: 'Domestic Traffic Inspector Connected',
    modal_add_title: 'Add New Download',
    lbl_url: 'Direct File URL:',
    lbl_filename: 'Custom Save Name (Optional):',
    lbl_queue: 'Download Queue:',
    lbl_conns: 'Parallel Connections (Q):',
    btn_cancel: 'Cancel',
    btn_start: 'Start Download',
    sched_title: 'Scheduler & Queue Settings',
    sched_enable: 'Enable scheduled automatic download for this queue',
    sched_start_at: 'Start download at:',
    sched_stop_at: 'Stop download at:',
    sched_days_title: 'Days of week:',
    sched_post_title: 'Action when all downloads in this queue finish:',
    sched_shutdown_pc: 'Turn off computer when done',
    sched_sleep_pc: 'Sleep / Hibernate computer',
    sched_exit_app: 'Exit VortexDM application',
    sched_max_concur: 'Max concurrent downloads in queue:',
    btn_save_apply: 'Save & Apply',
    limit_title: 'Speed Limiter & Bandwidth Allocator',
    limit_intro: 'Set a global bandwidth ceiling. Traffic is dynamically and fairly balanced across all running downloads.',
    limit_unlimited: 'Unlimited (Max)',
    limit_custom: 'Or enter custom limit (KB/s):',
    btn_apply: 'Apply Limit',
    iran_check_title: 'Check Domestic Traffic (LinkIrani.ir)',
    iran_intro: 'Enter any URL or domain to inspect whether it qualifies for Iranian domestic half-price traffic.',
    btn_check: 'Check Traffic Status',
    iran_status_lbl: 'Traffic Rate:',
    iran_host: 'Host / Domain:',
    iran_ip: 'Server IP Address:',
    cm_resume: 'Resume Download',
    cm_pause: 'Stop Download',
    cm_open_folder: 'Open in Folder',
    cm_copy: 'Copy Download URL',
    cm_check_iran: 'Inspect on LinkIrani.ir',
    cm_delete: 'Delete from Queue & Disk',
    status_queued: 'Queued',
    status_probing: 'Probing...',
    status_downloading: 'Downloading',
    status_paused: 'Paused',
    status_completed: 'Completed',
    status_error: 'Error',
    traffic_domestic: '🟢 Domestic (Half)',
    traffic_intl: '🌐 International (Full)',
    confirm_delete: 'Are you sure you want to delete the selected download(s)?',
    unlimited: 'Unlimited',
    active_state: 'Active',
    inactive_state: 'Disabled'
  }
};

let currentLang = localStorage.getItem('vortex_lang') || 'fa';
let activeFilter = 'all';
let searchQuery = '';
let tasksData = [];
let selectedTaskIds = new Set();
let contextTaskId = null;
let currentSpeedLimit = 0;
let schedulerConfig = null;
let speedHistory = new Array(25).fill(0);

// --- 2. SVGs for File Categories ---
const categoryIcons = {
  video: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>`,
  audio: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>`,
  archive: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>`,
  software: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  document: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
  other: `<svg class="row-file-icon" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`
};

// --- 3. Language & i18n Functions ---
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

  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (t[key]) el.title = t[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });

  const langText = document.getElementById('langText');
  if (langText) {
    langText.textContent = (lang === 'fa') ? 'EN' : 'FA';
  }

  renderTasksGrid();
}

// --- 4. Format Utilities ---
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

// --- 5. Sparkline Canvas ---
const sparkCanvas = document.getElementById('speedSparkline');
const sparkCtx = sparkCanvas ? sparkCanvas.getContext('2d') : null;

function updateSparkline(newSpeed) {
  speedHistory.push(newSpeed);
  speedHistory.shift();
  if (!sparkCtx) return;

  const w = sparkCanvas.width;
  const h = sparkCanvas.height;
  sparkCtx.clearRect(0, 0, w, h);

  const maxVal = Math.max(...speedHistory, 1024 * 1024);
  const step = w / (speedHistory.length - 1);

  sparkCtx.beginPath();
  for (let i = 0; i < speedHistory.length; i++) {
    const y = h - (speedHistory[i] / maxVal) * (h - 4) - 2;
    const x = i * step;
    if (i === 0) sparkCtx.moveTo(x, y);
    else sparkCtx.lineTo(x, y);
  }
  sparkCtx.strokeStyle = '#00f2fe';
  sparkCtx.lineWidth = 1.6;
  sparkCtx.stroke();
}

// --- 6. Main Grid Rendering (High Information Density) ---
const tasksGridBody = document.getElementById('tasksGridBody');
const emptyTasksState = document.getElementById('emptyTasksState');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const selectedCountText = document.getElementById('selectedCountText');
const globalSpeedVal = document.getElementById('globalSpeedVal');

const countAllEl = document.getElementById('countAll');
const countActiveEl = document.getElementById('countActive');
const countDoneEl = document.getElementById('countDone');

function renderTasksGrid() {
  const t = translations[currentLang];

  // Filtering
  let filtered = tasksData.filter(task => {
    if (activeFilter === 'unfinished') {
      if (task.status === 'completed') return false;
    } else if (activeFilter === 'finished') {
      if (task.status !== 'completed') return false;
    } else if (activeFilter === 'compressed' || activeFilter === 'documents' || activeFilter === 'music' || activeFilter === 'programs' || activeFilter === 'video') {
      const mappedCat = (activeFilter === 'compressed') ? 'archive' : (activeFilter === 'documents') ? 'document' : (activeFilter === 'programs') ? 'software' : (activeFilter === 'music') ? 'audio' : 'video';
      if (task.category !== mappedCat) return false;
    } else if (activeFilter === 'queue-main') {
      if (task.queue !== 'main') return false;
    } else if (activeFilter === 'queue-night') {
      if (task.queue !== 'night') return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = (task.filename || '').toLowerCase().includes(q);
      const matchUrl = (task.url || '').toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }

    return true;
  });

  // Counts update
  if (countAllEl) countAllEl.textContent = tasksData.length;
  if (countActiveEl) countActiveEl.textContent = tasksData.filter(x => x.status !== 'completed').length;
  if (countDoneEl) countDoneEl.textContent = tasksData.filter(x => x.status === 'completed').length;

  if (selectedCountText) {
    selectedCountText.textContent = `${t.selected_count} ${selectedTaskIds.size}`;
  }

  if (filtered.length === 0) {
    if (emptyTasksState) emptyTasksState.classList.remove('hidden');
    const existingRows = tasksGridBody.querySelectorAll('.grid-row');
    existingRows.forEach(r => r.remove());
    return;
  }

  if (emptyTasksState) emptyTasksState.classList.add('hidden');

  // Maintain DOM elements without full recreation
  const currentIds = new Set(filtered.map(x => x.id));
  const existingRows = tasksGridBody.querySelectorAll('.grid-row');
  existingRows.forEach(r => {
    if (!currentIds.has(r.dataset.id)) r.remove();
  });

  filtered.forEach(task => {
    let row = tasksGridBody.querySelector(`.grid-row[data-id="${task.id}"]`);
    if (!row) {
      row = document.createElement('div');
      row.className = 'grid-row';
      row.dataset.id = task.id;
      tasksGridBody.appendChild(row);
    }
    updateRowContent(row, task, t);
  });
}

function updateRowContent(row, task, t) {
  const isSelected = selectedTaskIds.has(task.id);
  if (isSelected) row.classList.add('selected');
  else row.classList.remove('selected');

  const percent = Math.min(100, Math.max(0, task.progress || 0)).toFixed(1);
  const isDone = task.status === 'completed';
  const isPaused = task.status === 'paused';
  const isDownloading = task.status === 'downloading' || task.status === 'probing';
  const isFailed = task.status === 'error';

  let barClass = '';
  if (isDone) barClass = 'done';
  else if (isPaused) barClass = 'paused';

  const totalSize = task.total_size || 0;
  const sizeStr = totalSize > 0 ? formatBytes(totalSize) : '--';
  const speedStr = isDownloading ? formatSpeed(task.speed || 0) : (isPaused ? t.status_paused : (isDone ? t.status_completed : '--'));
  const etaStr = (isDownloading && task.eta) ? task.eta : (isDone ? t.status_completed : '--');

  // Traffic badge (LinkIrani Domestic vs International)
  const isDomestic = task.traffic_badge === 'domestic';
  const trafficClass = isDomestic ? 'domestic' : 'international';
  const trafficLabel = isDomestic ? t.traffic_domestic : t.traffic_intl;

  // Queue Tag
  const queueName = task.queue === 'night' ? t.queue_night : t.queue_main;
  const queueClass = task.queue === 'night' ? 'queue-tag night' : 'queue-tag';

  // Category Icon
  const catIcon = categoryIcons[task.category] || categoryIcons.other;

  row.innerHTML = `
    <div class="col col-check"><input type="checkbox" class="row-cb" data-id="${task.id}" ${isSelected ? 'checked' : ''}></div>
    <div class="col col-name" title="${task.filename}&#10;${task.url}">
      <div class="row-file-wrap">
        ${catIcon}
        <span class="row-file-name">${task.filename}</span>
      </div>
    </div>
    <div class="col col-size ltr-num">${sizeStr}</div>
    <div class="col col-progress">
      <div class="compact-progress-wrap">
        <div class="compact-bar-bg" dir="ltr">
          <div class="compact-bar-fill ${barClass}" style="width: ${percent}%;"></div>
        </div>
        <span class="compact-pct ltr-num">${percent}%</span>
      </div>
    </div>
    <div class="col col-speed ltr-num">${speedStr}</div>
    <div class="col col-eta ltr-num">${etaStr}</div>
    <div class="col col-traffic">
      <span class="traffic-badge ${trafficClass}" title="استعلام در LinkIrani.ir">
        <span class="traffic-dot"></span>
        ${trafficLabel}
      </span>
    </div>
    <div class="col col-queue"><span class="${queueClass}">${queueName}</span></div>
    <div class="col col-conn ltr-num">${task.connections || 16}</div>
  `;
}

// --- 7. Event Source (SSE) & REST Polling ---
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
        updateSparkline(data.total_speed);
      }
      if (typeof data.speed_limit === 'number') {
        currentSpeedLimit = data.speed_limit;
        updateSpeedLimitStatus(data.speed_limit);
      }
      renderTasksGrid();
    } catch (err) {
      console.error('Failed to parse SSE payload', err);
    }
  });

  evtSource.onerror = (err) => {
    evtSource.close();
    setTimeout(initSSE, 3500);
  };
}

async function fetchTasksREST() {
  try {
    const res = await fetch('/api/tasks');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.tasks)) tasksData = data.tasks;
      if (typeof data.total_speed === 'number') {
        if (globalSpeedVal) globalSpeedVal.textContent = formatSpeed(data.total_speed);
        updateSparkline(data.total_speed);
      }
      if (typeof data.speed_limit === 'number') {
        currentSpeedLimit = data.speed_limit;
        updateSpeedLimitStatus(data.speed_limit);
      }
      renderTasksGrid();
    }
  } catch (e) {}
}

function updateSpeedLimitStatus(limit) {
  const sbLimitStatus = document.getElementById('sbLimitStatus');
  const tbLimitLabel = document.getElementById('tbLimitLabel');
  const t = translations[currentLang];
  if (limit > 0) {
    const limitFormatted = formatSpeed(limit);
    if (sbLimitStatus) sbLimitStatus.textContent = limitFormatted;
    if (tbLimitLabel) tbLimitLabel.textContent = limitFormatted;
  } else {
    if (sbLimitStatus) sbLimitStatus.textContent = t.unlimited;
    if (tbLimitLabel) tbLimitLabel.textContent = t.tb_speed_limit;
  }
}

// --- 8. Table Selection & Checkbox Handlers ---
tasksGridBody.addEventListener('click', (e) => {
  const cb = e.target.closest('.row-cb');
  const row = e.target.closest('.grid-row');
  if (!row) return;

  const id = row.dataset.id;
  if (cb) {
    if (cb.checked) selectedTaskIds.add(id);
    else selectedTaskIds.delete(id);
  } else {
    // Single row click toggle
    if (e.ctrlKey || e.metaKey) {
      if (selectedTaskIds.has(id)) selectedTaskIds.delete(id);
      else selectedTaskIds.add(id);
    } else {
      selectedTaskIds.clear();
      selectedTaskIds.add(id);
    }
  }
  renderTasksGrid();
});

if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', () => {
    if (selectAllCheckbox.checked) {
      tasksData.forEach(t => selectedTaskIds.add(t.id));
    } else {
      selectedTaskIds.clear();
    }
    renderTasksGrid();
  });
}

// --- 9. Toolbar Actions Implementation ---
const tbAddUrl = document.getElementById('tbAddUrl');
const tbResume = document.getElementById('tbResume');
const tbPause = document.getElementById('tbPause');
const tbPauseAll = document.getElementById('tbPauseAll');
const tbDelete = document.getElementById('tbDelete');
const tbClearDone = document.getElementById('tbClearDone');
const tbScheduler = document.getElementById('tbScheduler');
const tbSpeedLimit = document.getElementById('tbSpeedLimit');
const tbLinkIrani = document.getElementById('tbLinkIrani');

if (tbResume) {
  tbResume.addEventListener('click', async () => {
    if (selectedTaskIds.size === 0) {
      await fetch('/api/tasks/start-all', { method: 'POST' });
    } else {
      for (const id of selectedTaskIds) {
        await fetch(`/api/tasks/start?id=${id}`, { method: 'POST' });
      }
    }
    fetchTasksREST();
  });
}

if (tbPause) {
  tbPause.addEventListener('click', async () => {
    for (const id of selectedTaskIds) {
      await fetch(`/api/tasks/pause?id=${id}`, { method: 'POST' });
    }
    fetchTasksREST();
  });
}

if (tbPauseAll) {
  tbPauseAll.addEventListener('click', async () => {
    await fetch('/api/tasks/pause-all', { method: 'POST' });
    fetchTasksREST();
  });
}

if (tbDelete) {
  tbDelete.addEventListener('click', async () => {
    if (selectedTaskIds.size === 0) return;
    const t = translations[currentLang];
    if (confirm(t.confirm_delete)) {
      for (const id of selectedTaskIds) {
        await fetch(`/api/tasks/delete?id=${id}`, { method: 'POST' });
      }
      selectedTaskIds.clear();
      fetchTasksREST();
    }
  });
}

if (tbClearDone) {
  tbClearDone.addEventListener('click', async () => {
    await fetch('/api/tasks/clear-completed', { method: 'POST' });
    selectedTaskIds.clear();
    fetchTasksREST();
  });
}

// --- 10. Context Menu Logic ---
const contextMenu = document.getElementById('contextMenu');

window.addEventListener('click', () => {
  if (contextMenu) contextMenu.classList.add('hidden');
});

tasksGridBody.addEventListener('contextmenu', (e) => {
  const row = e.target.closest('.grid-row');
  if (!row) return;
  e.preventDefault();

  contextTaskId = row.dataset.id;
  selectedTaskIds.clear();
  selectedTaskIds.add(contextTaskId);
  renderTasksGrid();

  if (contextMenu) {
    contextMenu.classList.remove('hidden');
    let x = e.clientX;
    let y = e.clientY;
    if (x + 180 > window.innerWidth) x = window.innerWidth - 185;
    if (y + 220 > window.innerHeight) y = window.innerHeight - 225;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
  }
});

if (contextMenu) {
  contextMenu.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-cm]');
    if (!item || !contextTaskId) return;

    const action = item.dataset.cm;
    const task = tasksData.find(t => t.id === contextTaskId);

    if (action === 'start') {
      await fetch(`/api/tasks/start?id=${contextTaskId}`, { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'pause') {
      await fetch(`/api/tasks/pause?id=${contextTaskId}`, { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'open') {
      await fetch(`/api/tasks/open?id=${contextTaskId}`, { method: 'POST' });
    } else if (action === 'copy' && task) {
      navigator.clipboard.writeText(task.url);
    } else if (action === 'linkirani' && task) {
      window.open(task.linkirani_url || `https://linkirani.ir/?url=${encodeURIComponent(task.url)}`, '_blank');
    } else if (action === 'delete') {
      const t = translations[currentLang];
      if (confirm(t.confirm_delete)) {
        await fetch(`/api/tasks/delete?id=${contextTaskId}`, { method: 'POST' });
        selectedTaskIds.delete(contextTaskId);
        fetchTasksREST();
      }
    }
  });
}

// --- 11. Modal: Add New Download ---
const taskModal = document.getElementById('taskModal');
const closeAddModal = document.getElementById('closeAddModal');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const submitAddBtn = document.getElementById('submitAddBtn');
const modalUrlInput = document.getElementById('modalUrlInput');
const modalFilenameInput = document.getElementById('modalFilenameInput');
const modalQueueSelect = document.getElementById('modalQueueSelect');
const modalConnsSelect = document.getElementById('modalConnsSelect');
const trafficNotice = document.getElementById('trafficDetectionNotice');
const trafficNoticeTag = document.getElementById('trafficNoticeTag');
const trafficNoticeDesc = document.getElementById('trafficNoticeDesc');
const trafficNoticeLink = document.getElementById('trafficNoticeLink');

function openAddModal() {
  taskModal.classList.remove('hidden');
  modalUrlInput.value = '';
  modalFilenameInput.value = '';
  trafficNotice.classList.add('hidden');
  modalUrlInput.focus();

  if (navigator.clipboard && navigator.clipboard.readText) {
    navigator.clipboard.readText().then(text => {
      if (text && (text.startsWith('http://') || text.startsWith('https://'))) {
        modalUrlInput.value = text.trim();
        checkUrlTraffic(text.trim());
      }
    }).catch(() => {});
  }
}

async function checkUrlTraffic(url) {
  try {
    const res = await fetch(`/api/traffic/check?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const info = await res.json();
      trafficNotice.classList.remove('hidden');
      if (info.is_domestic) {
        trafficNoticeTag.className = 'traffic-tag domestic';
        trafficNoticeTag.textContent = '🟢 ترافیک داخلی (نیم‌بها)';
        trafficNoticeDesc.textContent = `سرور در دیتاسنتر داخلی ایران واقع شده است (${info.host})`;
      } else {
        trafficNoticeTag.className = 'traffic-tag international';
        trafficNoticeTag.textContent = '🌐 ترافیک بین‌الملل (تمام‌بها)';
        trafficNoticeDesc.textContent = `سرور در خارج از کشور قرار دارد (${info.host})`;
      }
      trafficNoticeLink.href = info.linkirani_url;
    }
  } catch (e) {}
}

modalUrlInput.addEventListener('input', () => {
  const val = modalUrlInput.value.trim();
  if (val.startsWith('http://') || val.startsWith('https://')) {
    checkUrlTraffic(val);
  }
});

if (tbAddUrl) tbAddUrl.addEventListener('click', openAddModal);
if (closeAddModal) closeAddModal.addEventListener('click', () => taskModal.classList.add('hidden'));
if (cancelAddBtn) cancelAddBtn.addEventListener('click', () => taskModal.classList.add('hidden'));

if (submitAddBtn) {
  submitAddBtn.addEventListener('click', async () => {
    const url = modalUrlInput.value.trim();
    if (!url) {
      modalUrlInput.focus();
      return;
    }

    const filename = modalFilenameInput.value.trim();
    const connections = parseInt(modalConnsSelect.value, 10) || 16;
    const queue = modalQueueSelect.value || 'main';

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, filename, connections, queue })
      });

      if (res.ok) {
        taskModal.classList.add('hidden');
        fetchTasksREST();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to add task');
      }
    } catch (e) {
      alert('Connection error');
    }
  });
}

// --- 12. Modal: Scheduler & Night Download ---
const schedulerModal = document.getElementById('schedulerModal');
const closeSchedModal = document.getElementById('closeSchedModal');
const cancelSchedBtn = document.getElementById('cancelSchedBtn');
const saveSchedBtn = document.getElementById('saveSchedBtn');
const schedEnable = document.getElementById('schedEnable');
const schedStartCheck = document.getElementById('schedStartCheck');
const schedStartTime = document.getElementById('schedStartTime');
const schedStopCheck = document.getElementById('schedStopCheck');
const schedStopTime = document.getElementById('schedStopTime');
const schedShutdownPC = document.getElementById('schedShutdownPC');
const schedSleepPC = document.getElementById('schedSleepPC');
const schedExitApp = document.getElementById('schedExitApp');
const schedMaxConcur = document.getElementById('schedMaxConcur');
let activeSchedTab = 'night';

async function openSchedulerModal() {
  schedulerModal.classList.remove('hidden');
  try {
    const res = await fetch('/api/scheduler');
    if (res.ok) {
      schedulerConfig = await res.json();
      populateSchedulerUI();
    }
  } catch (e) {}
}

function populateSchedulerUI() {
  if (!schedulerConfig) return;
  const qCfg = (activeSchedTab === 'night') ? schedulerConfig.night_queue : schedulerConfig.main_queue;
  if (!qCfg) return;

  schedEnable.checked = qCfg.enabled;
  schedStartTime.value = qCfg.start_time || '02:00';
  schedStopTime.value = qCfg.stop_time || '07:30';
  schedStartCheck.checked = !!qCfg.start_time;
  schedStopCheck.checked = !!qCfg.stop_time;
  schedShutdownPC.checked = !!qCfg.shutdown_on_done;
  schedSleepPC.checked = !!qCfg.sleep_on_done;
  schedExitApp.checked = !!qCfg.exit_on_done;
  schedMaxConcur.value = qCfg.max_concurrent || 1;

  const dayCbs = document.querySelectorAll('.day-cb');
  const daysSet = new Set(qCfg.days || []);
  dayCbs.forEach(cb => {
    cb.checked = daysSet.has(parseInt(cb.value, 10));
  });
}

document.querySelectorAll('.sched-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.sched-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeSchedTab = tab.dataset.queue;
    populateSchedulerUI();
  });
});

if (tbScheduler) tbScheduler.addEventListener('click', openSchedulerModal);
if (closeSchedModal) closeSchedModal.addEventListener('click', () => schedulerModal.classList.add('hidden'));
if (cancelSchedBtn) cancelSchedBtn.addEventListener('click', () => schedulerModal.classList.add('hidden'));

if (saveSchedBtn) {
  saveSchedBtn.addEventListener('click', async () => {
    if (!schedulerConfig) return;

    const selectedDays = [];
    document.querySelectorAll('.day-cb:checked').forEach(cb => {
      selectedDays.push(parseInt(cb.value, 10));
    });

    const targetQueue = (activeSchedTab === 'night') ? schedulerConfig.night_queue : schedulerConfig.main_queue;
    targetQueue.enabled = schedEnable.checked;
    targetQueue.start_time = schedStartTime.value;
    targetQueue.stop_time = schedStopTime.value;
    targetQueue.days = selectedDays;
    targetQueue.shutdown_on_done = schedShutdownPC.checked;
    targetQueue.sleep_on_done = schedSleepPC.checked;
    targetQueue.exit_on_done = schedExitApp.checked;
    targetQueue.max_concurrent = parseInt(schedMaxConcur.value, 10) || 1;

    try {
      await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schedulerConfig)
      });
      schedulerModal.classList.add('hidden');

      const sbSchedStatus = document.getElementById('sbSchedStatus');
      const t = translations[currentLang];
      if (sbSchedStatus) {
        sbSchedStatus.textContent = (schedulerConfig.night_queue.enabled || schedulerConfig.main_queue.enabled) ? t.active_state : t.inactive_state;
      }
    } catch (e) {
      alert('Failed to save scheduler');
    }
  });
}

// --- 13. Modal: Speed Limiter & Smart Allocator ---
const speedLimitModal = document.getElementById('speedLimitModal');
const closeLimitModal = document.getElementById('closeLimitModal');
const cancelLimitBtn = document.getElementById('cancelLimitBtn');
const saveLimitBtn = document.getElementById('saveLimitBtn');
const customLimitInput = document.getElementById('customLimitInput');

function openSpeedLimitModal() {
  speedLimitModal.classList.remove('hidden');
  const currentKb = Math.round(currentSpeedLimit / 1024);
  customLimitInput.value = currentKb > 0 ? currentKb : '';

  document.querySelectorAll('.preset-btn').forEach(btn => {
    const kb = parseInt(btn.dataset.kb, 10);
    if (kb === currentKb) btn.classList.add('active');
    else btn.classList.remove('active');
  });
}

document.querySelectorAll('.preset-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const kb = parseInt(btn.dataset.kb, 10);
    customLimitInput.value = kb > 0 ? kb : '';
  });
});

if (tbSpeedLimit) tbSpeedLimit.addEventListener('click', openSpeedLimitModal);
if (closeLimitModal) closeLimitModal.addEventListener('click', () => speedLimitModal.classList.add('hidden'));
if (cancelLimitBtn) cancelLimitBtn.addEventListener('click', () => speedLimitModal.classList.add('hidden'));

if (saveLimitBtn) {
  saveLimitBtn.addEventListener('click', async () => {
    let kb = parseInt(customLimitInput.value, 10) || 0;
    const limitBytes = kb * 1024;
    try {
      await fetch('/api/speed-limit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: limitBytes })
      });
      currentSpeedLimit = limitBytes;
      updateSpeedLimitStatus(limitBytes);
      speedLimitModal.classList.add('hidden');
    } catch (e) {
      alert('Failed to set speed limit');
    }
  });
}

// --- 14. Modal: LinkIrani.ir Domestic Check Dialog ---
const linkIraniModal = document.getElementById('linkIraniModal');
const closeIranModal = document.getElementById('closeIranModal');
const iranUrlInput = document.getElementById('iranUrlInput');
const btnRunIranCheck = document.getElementById('btnRunIranCheck');
const iranCheckResultBox = document.getElementById('iranCheckResultBox');
const iranResultBadge = document.getElementById('iranResultBadge');
const iranResultHost = document.getElementById('iranResultHost');
const iranResultIP = document.getElementById('iranResultIP');
const iranExternalVerifyBtn = document.getElementById('iranExternalVerifyBtn');

function openLinkIraniModal() {
  linkIraniModal.classList.remove('hidden');
  iranUrlInput.value = '';
  iranCheckResultBox.classList.add('hidden');
  iranUrlInput.focus();
}

if (tbLinkIrani) tbLinkIrani.addEventListener('click', openLinkIraniModal);
if (closeIranModal) closeIranModal.addEventListener('click', () => linkIraniModal.classList.add('hidden'));

if (btnRunIranCheck) {
  btnRunIranCheck.addEventListener('click', async () => {
    const raw = iranUrlInput.value.trim();
    if (!raw) return;

    try {
      btnRunIranCheck.textContent = 'در حال استعلام...';
      const res = await fetch(`/api/traffic/check?url=${encodeURIComponent(raw)}`);
      btnRunIranCheck.textContent = translations[currentLang].btn_check;

      if (res.ok) {
        const data = await res.json();
        iranCheckResultBox.classList.remove('hidden');
        if (data.is_domestic) {
          iranResultBadge.className = 'traffic-badge domestic';
          iranResultBadge.textContent = '🟢 ترافیک داخلی (نیم‌بها)';
        } else {
          iranResultBadge.className = 'traffic-badge international';
          iranResultBadge.textContent = '🌐 ترافیک بین‌الملل (تمام‌بها)';
        }
        iranResultHost.textContent = data.host;
        iranResultIP.textContent = data.ip_address || '---';
        iranExternalVerifyBtn.href = data.linkirani_url;
      }
    } catch (e) {
      btnRunIranCheck.textContent = translations[currentLang].btn_check;
      alert('Error querying traffic status');
    }
  });
}

// --- 15. Sidebar Categories Tree Filter Handlers ---
document.querySelectorAll('.tree-node').forEach(node => {
  node.addEventListener('click', () => {
    document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
    node.classList.add('active');
    activeFilter = node.dataset.filter || 'all';
    renderTasksGrid();
  });
});

const searchInput = document.getElementById('searchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderTasksGrid();
  });
}

const langToggleBtn = document.getElementById('langToggleBtn');
if (langToggleBtn) {
  langToggleBtn.addEventListener('click', () => {
    setLanguage(currentLang === 'fa' ? 'en' : 'fa');
  });
}

// --- 16. App Bootstrapping ---
window.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
  initSSE();
  setInterval(fetchTasksREST, 1500);

  // Initial scheduler check
  fetch('/api/scheduler').then(r => r.json()).then(cfg => {
    schedulerConfig = cfg;
    const sbSchedStatus = document.getElementById('sbSchedStatus');
    const t = translations[currentLang];
    if (sbSchedStatus && cfg) {
      sbSchedStatus.textContent = (cfg.night_queue.enabled || cfg.main_queue.enabled) ? t.active_state : t.inactive_state;
    }
  }).catch(() => {});
});
