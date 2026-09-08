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
    tb_minimize_tip: 'کوچک‌سازی پنجره',
    tip_toggle_sidebar: 'کوچک‌سازی/بازگشایی پنل',
    tip_expand_sidebar: 'نمایش منوی دسته‌بندی‌ها',
    speed_lbl: 'سرعت کل:',
    tree_categories: 'دسته‌بندی‌ها',
    tree_queues: 'صف‌های دانلود',
    cat_all: 'همه دانلودها',
    cat_compressed: 'فشرده',
    cat_documents: 'اسناد',
    cat_music: 'موسیقی و صدا',
    cat_programs: 'نرم‌افزارها',
    cat_video: 'ویدیوها',
    cat_unfinished: 'ناتمام',
    cat_finished: 'تکمیل‌شده',
    queue_main: 'صف اصلی',
    queue_night: 'صف شبانه',
    search_filter: 'فیلتر و جستجو در میان فایل‌ها...',
    selected_count: 'مورد انتخاب شده: ',
    col_filename: 'نام فایل',
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
    sched_title: 'تنظیمات زمان‌بندی و صف دانلود',
    sched_enable: 'فعال‌سازی دانلود خودکار بر اساس زمان‌بندی برای این صف',
    sched_start_at: 'شروع دانلود در ساعت:',
    sched_stop_at: 'توقف دانلود در ساعت:',
    sched_days_title: 'روزهای اجرای برنامه در هفته:',
    sched_post_title: 'عملیات پس از اتمام تمام فایل‌های این صف:',
    sched_shutdown_pc: 'خاموش کردن رایانه پس از پایان دانلود',
    sched_sleep_pc: 'به حالت آماده‌باش بردن سیستم (خواب)',
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
    unlimited: 'نامحدود',
    active_state: 'فعال',
    inactive_state: 'غیرفعال',
    tb_analytics: 'گزارش مصرف',
    tb_analytics_tip: 'آمار و گزارش تفکیکی مصرف اینترنت',
    analytics_title: 'آمار و گزارش مصرف اینترنت',
    analytics_reset_btn: 'شروع دوره جدید',
    analytics_total_traffic: 'کل ترافیک مصرفی',
    analytics_domestic_traffic: 'مصرف نیم‌بها (داخلی)',
    analytics_intl_traffic: 'مصرف تمام‌بها (بین‌الملل)',
    analytics_saved_traffic: 'صرفه‌جویی با نیم‌بها',
    analytics_chart_title: 'نمودار توزیع مصرف داده',
    analytics_hourly_view: 'ساعت به ساعت (۲۴ ساعت گذشته)',
    analytics_daily_view: 'روزانه (۱۴ روز اخیر)',
    analytics_logs_title: 'آخرین فایل‌های ثبت‌شده در لاگ مصرف',
    analytics_th_filename: 'نام فایل',
    analytics_th_size: 'حجم فایل',
    analytics_th_tariff: 'نوع تعرفه',
    analytics_th_time: 'زمان ثبت',
    analytics_no_logs: 'هنوز دانلودی در این دوره ثبت نشده است',
    queue_modal_title: 'ایجاد صف دانلود جدید',
    btn_add_queue_tip: 'ایجاد صف دانلود اختصاصی جدید',
    queue_lbl_name: 'نام صف:',
    queue_lbl_concur: 'حداکثر دانلودهای همزمان در این صف:',
    queue_btn_create: 'ایجاد صف',
    col_order: 'ترتیب',
    col_reorder: 'ترتیب',
    col_queue: 'صف',
    col_conn: 'اتصال',
    tb_batch: 'دانلود دسته‌ای',
    tb_batch_tip: 'افزودن دسته‌ای لینک‌ها',
    batch_modal_title: 'دانلود دسته‌ای لینک‌ها',
    batch_lbl_urls: 'نشانی‌های دانلود (هر نشانی در یک خط):',
    batch_lbl_queue: 'صف مقصد:',
    batch_lbl_threads: 'اتصالات همزمان هر فایل:',
    batch_chk_autostart: 'شروع دانلود بلافاصله پس از افزودن',
    batch_btn_import: 'افزودن همه به صف',
    cm_checksum: 'بررسی هش و اصالت (SHA-256 / MD5)',
    cs_modal_title: 'بررسی هش و اصالت فایل',
    cs_file_lbl: 'فایل:',
    cs_verify_lbl: 'مقایسه با هش ارائه‌شده توسط سایت مبدأ:',
    cs_verify_placeholder: 'هش SHA-256 یا MD5 را اینجا پیست کنید...',
    cs_match_msg: '✅ هش فایل کاملاً تطابق دارد (فایل بدون دستکاری و سالم است)',
    cs_mismatch_msg: '❌ هش تطابق ندارد! ممکن است فایل ناقص یا دستکاری شده باشد',
    btn_close: 'بستن',
    tip_copy: 'کپی هش',
    toast_clip_title: 'لینک دانلود در کلیپ‌بورد شناسایی شد',
    toast_clip_download: 'دانلود سریع',
    tip_mode_toggle: 'تغییر به حالت ساده یا پیشرفته',
    mode_simple: 'ساده',
    mode_pro: 'پیشرفته',
    mode_simple_opt: 'ساده (خلوت، روان و متمرکز)',
    mode_pro_opt: 'پیشرفته (ابزارهای تخصصی و تنظیمات کامل)',
    tb_settings: 'تنظیمات',
    tb_settings_tip: 'تنظیمات عمومی نرم‌افزار',
    settings_title: 'تنظیمات',
    settings_default_dir: 'پوشه پیش‌فرض ذخیره فایل‌ها:',
    settings_default_mode: 'حالت پیش‌فرض رابط کاربری:',
    settings_sound_toggle: 'پخش صدای اعلان هنگام شروع و اتمام دانلود',
    settings_extract_toggle: 'استخراج خودکار فایل‌های فشرده پس از اتمام دانلود',
    settings_saved: 'تنظیمات با موفقیت ذخیره شد',
    btn_save: 'ذخیره تنظیمات',
    lbl_dest_dir: 'پوشه ذخیره‌سازی (اختیاری):',
    cm_refresh_url: 'تمدید نشانی دانلود (لینک منقضی‌شده)',
    cm_extract: 'استخراج فایل فشرده',
    refresh_modal_title: 'تمدید نشانی دانلود منقضی‌شده',
    refresh_file_lbl: 'فایل:',
    refresh_new_url_lbl: 'نشانی جدید (لینک تازه دریافت شده):',
    refresh_btn_apply: 'به‌روزرسانی نشانی و ادامه دانلود',
    refresh_success: 'نشانی با موفقیت به‌روز شد و دانلود از نقطه قبلی ادامه یافت',
    extract_success: 'فایل فشرده با موفقیت در کنار فایل اصلی استخراج شد',
    extract_err: 'خطا در استخراج فایل فشرده',
    tb_speedtest: 'تست سرعت',
    tb_speedtest_tip: 'تست پینگ و سنجش سرعت اتصال اینترنت',
    settings_proxy_toggle: 'فعال‌سازی پروکسی برای دانلودها',
    settings_proxy_type: 'نوع پروکسی:',
    settings_proxy_addr: 'نشانی و پورت سرور:',
    settings_proxy_bypass: 'عبور مستقیم ترافیک داخلی و سایت‌های نیم‌بها',
    share_modal_title: 'انتقال بی‌سیم به موبایل',
    share_intro: 'با دوربین موبایل کد زیر را اسکن کنید تا فایل با نهایت سرعت شبکه محلی دانلود شود:',
    share_lbl_url: 'یا این آدرس را در مرورگر موبایل باز کنید:',
    preview_title: 'پیش‌نمایش مدیا',
    preview_note: 'پخش زنده قطعات ذخیره‌شده روی دیسک بدون نیاز به اتمام دانلود',
    speedtest_title: 'تست پینگ و سرعت اتصال شبکه',
    st_ping: 'زمان تاخیر شبکه',
    st_speed: 'سرعت دریافت',
    st_btn_start: 'شروع تست سرعت و تاخیر',
    st_testing_ping: 'در حال ارزیابی تاخیر سرور...',
    st_testing_speed: 'در حال سنجش سرعت دانلود...',
    st_completed: 'آزمون اتصال با موفقیت انجام شد',
    cm_preview: 'پیش‌نمایش مدیا',
    cm_share: 'ارسال به موبایل با اسکن کد',
    preview_unsupported: 'پیش‌نمایش برای این نوع فایل پشتیبانی نمی‌شود',
    tip_more_tools: 'سایر ابزارها و امکانات',
    placeholder_filename: 'نام خودکار از سرور دریافت می‌شود',
    placeholder_dest_dir: 'مسیر پیش‌فرض دانلودها...',
    btn_browse: 'انتخاب پوشه',
    tip_browse_dir: 'انتخاب پوشه از سیستم با فایل منیجر',
    tip_parallel_conns: 'تقسیم فایل به چندین بخش مجزا و دانلود هم‌زمان آن‌ها با اتصالات موازی که منجر به حداکثر استفاده از پهنای باند و افزایش چشمگیر سرعت دانلود می‌شود (پیشنهادی: ۱۶ یا ۳۲ اتصال).',
    conn_16: '۱۶ اتصال (توربو استاندارد)',
    conn_32: '۳۲ اتصال (حداکثر پهنای باند)',
    conn_8: '۸ اتصال همزمان',
    conn_4: '۴ اتصال',
    conn_1: '۱ اتصال (تک‌استریم)',
    conn_batch_4: '۴ اتصال',
    conn_batch_8: '۸ اتصال (پیشنهادی)',
    conn_batch_16: '۱۶ اتصال (حداکثر سرعت)',
    conn_batch_32: '۳۲ اتصال',
    sched_tab_night: '🌙 صف شبانه',
    sched_tab_main: '📋 صف اصلی',
    day_0: 'یکشنبه',
    day_1: 'دوشنبه',
    day_2: 'سه‌شنبه',
    day_3: 'چهارشنبه',
    day_4: 'پنج‌شنبه',
    day_5: 'جمعه',
    day_6: 'شنبه',
    concur_1: '۱ فایل در هر لحظه (پیشنهادی برای صف شبانه)',
    concur_2: '۲ فایل همزمان',
    concur_3: '۳ فایل همزمان',
    concur_1_q: '۱ فایل (توالی منظم - پیشنهادی)',
    queue_name_placeholder: 'مثلاً: فیلم‌ها، دوره‌ها، نرم‌افزار...',
    settings_default_dir_placeholder: 'مسیر پوشه دانلود...',
    traffic_notice_domestic: '🟢 ترافیک داخلی (نیم‌بها)',
    traffic_notice_intl: '🌐 ترافیک بین‌الملل (تمام‌بها)',
    traffic_desc_domestic: 'سرور در دیتاسنتر داخلی ایران واقع شده است',
    traffic_desc_intl: 'سرور در خارج از کشور میزبانی می‌شود'
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
    tb_minimize_tip: 'Minimize Window',
    tip_toggle_sidebar: 'Toggle Sidebar',
    tip_expand_sidebar: 'Expand Categories Menu',
    tip_more_tools: 'More Tools & Features',
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
    inactive_state: 'Disabled',
    tb_analytics: 'Data Usage',
    tb_analytics_tip: 'Internet traffic analytics and bandwidth log',
    analytics_title: 'Internet Traffic & Data Usage Analytics',
    analytics_reset_btn: 'Reset Billing Cycle',
    analytics_total_traffic: 'Total Data Consumed',
    analytics_domestic_traffic: 'Domestic Traffic (Half-Price)',
    analytics_intl_traffic: 'International Traffic (Full-Price)',
    analytics_saved_traffic: 'Bandwidth Savings',
    analytics_chart_title: 'Bandwidth Consumption Distribution',
    analytics_hourly_view: 'Hourly (Past 24 Hours)',
    analytics_daily_view: 'Daily (Past 14 Days)',
    analytics_logs_title: 'Recent Download Traffic History',
    analytics_th_filename: 'File Name',
    analytics_th_size: 'Size',
    analytics_th_tariff: 'Traffic Rate',
    analytics_th_time: 'Recorded At',
    analytics_no_logs: 'No downloads recorded in this cycle yet',
    queue_modal_title: 'Create New Download Queue',
    btn_add_queue_tip: 'Create custom download queue',
    queue_lbl_name: 'Queue Name:',
    queue_lbl_concur: 'Max Concurrent Downloads:',
    queue_btn_create: 'Create Queue',
    col_order: 'Order',
    col_reorder: 'Order',
    col_queue: 'Queue',
    col_conn: 'Threads',
    tb_batch: 'Batch Import',
    tb_batch_tip: 'Import multiple download URLs',
    batch_modal_title: 'Batch Download URLs',
    batch_lbl_urls: 'Download URLs (one per line):',
    batch_lbl_queue: 'Target Queue:',
    batch_lbl_threads: 'Parallel Connections:',
    batch_chk_autostart: 'Start downloading immediately after adding',
    batch_btn_import: 'Add All to Queue',
    cm_checksum: 'Verify Checksum (SHA-256 / MD5)',
    cs_modal_title: 'File Checksum Integrity',
    cs_file_lbl: 'File:',
    cs_verify_lbl: 'Compare against expected hash:',
    cs_verify_placeholder: 'Paste SHA-256 or MD5 hash here...',
    cs_match_msg: '✅ Hash matched perfectly (File is authentic and uncorrupted)',
    cs_mismatch_msg: '❌ Hash mismatch! The file may be corrupt or modified',
    btn_close: 'Close',
    tip_copy: 'Copy Hash',
    toast_clip_title: 'Download link detected in clipboard',
    toast_clip_download: 'Download',
    tip_mode_toggle: 'Switch between Simple & PRO mode',
    mode_simple: 'Simple',
    mode_pro: 'PRO',
    mode_simple_opt: 'Simple (Clean & Focused - Recommended)',
    mode_pro_opt: 'PRO (Full Power Tools)',
    tb_settings: 'Settings',
    tb_settings_tip: 'Application Settings',
    settings_title: 'VortexDM Settings',
    settings_default_dir: 'Default Download Directory:',
    settings_default_mode: 'Default UI Mode:',
    settings_sound_toggle: 'Play audio feedback on start and completion',
    settings_extract_toggle: 'Automatically extract ZIP archives upon completion',
    settings_saved: 'Settings saved successfully',
    btn_save: 'Save Settings',
    lbl_dest_dir: 'Destination Directory (Optional):',
    cm_refresh_url: 'Refresh Expired Download URL',
    cm_extract: 'Extract ZIP Archive',
    refresh_modal_title: 'Refresh Expired Download URL',
    refresh_file_lbl: 'File:',
    refresh_new_url_lbl: 'New Download URL (Fresh token link):',
    refresh_btn_apply: 'Update URL & Resume',
    refresh_success: 'Download URL refreshed successfully, resuming...',
    extract_success: 'Archive extracted successfully next to original file',
    extract_err: 'Failed to extract archive',
    tb_speedtest: 'Speed Test',
    tb_speedtest_tip: 'Network latency and download speed benchmark',
    settings_proxy_toggle: 'Enable Proxy for Downloads',
    settings_proxy_type: 'Proxy Protocol:',
    settings_proxy_addr: 'Server Address & Port:',
    settings_proxy_bypass: 'Automatically bypass domestic and Iranian traffic',
    share_modal_title: 'Wi-Fi Share to Mobile',
    share_intro: 'Scan this QR code with your mobile camera to stream and download over Wi-Fi:',
    share_lbl_url: 'Or open this direct URL in mobile browser:',
    preview_title: 'Media Streaming Preview',
    preview_note: 'Stream available chunks directly from disk with Range headers before completion',
    speedtest_title: 'Network Ping & Speed Benchmark',
    st_ping: 'Network Latency',
    st_speed: 'Download Throughput',
    st_btn_start: 'Run Speed Benchmark',
    st_testing_ping: 'Measuring network latency...',
    st_testing_speed: 'Benchmarking download throughput...',
    st_completed: 'Speed benchmark completed successfully',
    cm_preview: 'Streaming Preview',
    cm_share: 'Share to Mobile via QR',
    preview_unsupported: 'Preview is not supported for this file format',
    tip_more_tools: 'Other tools and features',
    placeholder_filename: 'Auto-detected from server',
    placeholder_dest_dir: 'Default download directory...',
    btn_browse: 'Browse...',
    tip_browse_dir: 'Select folder from system file manager',
    tip_parallel_conns: 'Splits the file into multiple separate chunks and downloads them simultaneously via parallel connections, maximizing bandwidth utilization and download speed (Recommended: 16 or 32 connections).',
    conn_16: '16 Connections (Standard Turbo)',
    conn_32: '32 Connections (Max Bandwidth)',
    conn_8: '8 Concurrent Connections',
    conn_4: '4 Connections',
    conn_1: '1 Connection (Single Stream)',
    conn_batch_4: '4 Connections',
    conn_batch_8: '8 Connections (Recommended)',
    conn_batch_16: '16 Connections (Max Speed)',
    conn_batch_32: '32 Connections',
    sched_tab_night: '🌙 Night Queue',
    sched_tab_main: '📋 Main Queue',
    day_0: 'Sunday',
    day_1: 'Monday',
    day_2: 'Tuesday',
    day_3: 'Wednesday',
    day_4: 'Thursday',
    day_5: 'Friday',
    day_6: 'Saturday',
    concur_1: '1 file at a time (Recommended for night queue)',
    concur_2: '2 files simultaneously',
    concur_3: '3 files simultaneously',
    concur_1_q: '1 file (Ordered sequence - Recommended)',
    queue_name_placeholder: 'e.g. Movies, Courses, Software...',
    settings_default_dir_placeholder: 'Download folder path...',
    traffic_notice_domestic: '🟢 Domestic Traffic (Half-Price)',
    traffic_notice_intl: '🌐 International Traffic (Full-Price)',
    traffic_desc_domestic: 'Hosted on Iranian domestic datacenter network',
    traffic_desc_intl: 'Hosted on international datacenter network'
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
let appSettings = {
  default_download_dir: '',
  default_ui_mode: 'simple',
  sound_enabled: true,
  auto_extract_zip: true,
  proxy_enabled: false,
  proxy_type: 'socks5',
  proxy_address: '',
  proxy_bypass_domestic: true
};
let currentUIMode = localStorage.getItem('vortex_ui_mode') || 'simple';
let previousTaskStatuses = new Map();

// --- Synthesized High-Tech Audio Engine (Zero-byte audio assets, pure Web Audio API) ---
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type, startTime, duration, startVol, endVol) {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    gain.gain.setValueAtTime(startVol, startTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  } catch (e) {}
}

function playCompletionChime() {
  if (!appSettings.sound_enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Pleasant futuristic 3-tone ascending chord
    playTone(523.25, 'sine', now, 0.12, 0.20, 0.02);
    playTone(659.25, 'sine', now + 0.07, 0.15, 0.22, 0.02);
    playTone(1046.50, 'sine', now + 0.14, 0.35, 0.25, 0.0001);
  } catch (e) {}
}

function playStartChime() {
  if (!appSettings.sound_enabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    playTone(440, 'triangle', now, 0.07, 0.14, 0.03);
    playTone(880, 'sine', now + 0.05, 0.14, 0.18, 0.001);
  } catch (e) {}
}


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

  const modeText = document.getElementById('modeText');
  if (modeText) {
    modeText.textContent = (currentUIMode === 'pro') ? t.mode_pro : t.mode_simple;
  }

  renderTasksGrid();
  if (typeof renderQueuesUI === 'function') {
    renderQueuesUI();
  }
  if (currentAnalyticsData && analyticsModal && !analyticsModal.classList.contains('hidden')) {
    renderAnalyticsChart();
  }
}

function setUIMode(mode, persist = true) {
  currentUIMode = mode;
  if (persist) {
    localStorage.setItem('vortex_ui_mode', mode);
  }

  document.body.classList.add('mode-switching');
  setTimeout(() => document.body.classList.remove('mode-switching'), 300);

  const t = translations[currentLang];
  const modeText = document.getElementById('modeText');
  const btnMode = document.getElementById('btnModeToggle');

  if (mode === 'pro') {
    document.body.classList.remove('mode-simple');
    document.body.classList.add('mode-pro');
    if (modeText) modeText.textContent = t.mode_pro || 'پیشرفته';
    if (btnMode) btnMode.setAttribute('aria-pressed', 'true');
  } else {
    document.body.classList.remove('mode-pro');
    document.body.classList.add('mode-simple');
    if (modeText) modeText.textContent = t.mode_simple || 'ساده';
    if (btnMode) btnMode.setAttribute('aria-pressed', 'false');
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

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let customQueues = {};
let customQueuesMap = {};

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
    } else if (activeFilter.startsWith('queue-')) {
      const targetQueue = activeFilter.slice(6);
      if (task.queue !== targetQueue) return false;
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = (task.filename || '').toLowerCase().includes(q);
      const matchUrl = (task.url || '').toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }

    return true;
  });

  // Sort by order ascending
  filtered.sort((a, b) => (a.order || 0) - (b.order || 0));

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

  filtered.forEach((task, idx) => {
    let row = tasksGridBody.querySelector(`.grid-row[data-id="${task.id}"]`);
    if (!row) {
      row = document.createElement('div');
      row.className = 'grid-row';
      row.dataset.id = task.id;
      tasksGridBody.appendChild(row);
    }
    updateRowContent(row, task, t, idx + 1);
  });
}

function updateRowContent(row, task, t, displayOrder) {
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
  let queueName = task.queue === 'night' ? t.queue_night : (task.queue === 'main' ? t.queue_main : (customQueuesMap[task.queue] || task.queue));
  const queueClass = task.queue === 'night' ? 'queue-tag night' : 'queue-tag';

  // Category Icon
  const catIcon = categoryIcons[task.category] || categoryIcons.other;

  row.innerHTML = `
    <div class="col col-check"><input type="checkbox" class="row-cb" data-id="${task.id}" ${isSelected ? 'checked' : ''}></div>
    <div class="col col-order pro-only ltr-num">${task.order || displayOrder}</div>
    <div class="col col-name" title="${escapeHtml(task.filename)}&#10;${escapeHtml(task.url)}">
      <div class="row-file-wrap">
        ${catIcon}
        <span class="row-file-name">${escapeHtml(task.filename)}</span>
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
    <div class="col col-traffic iran-only">
      <span class="traffic-badge ${trafficClass}" title="استعلام در LinkIrani.ir">
        <span class="traffic-dot"></span>
        ${trafficLabel}
      </span>
    </div>
    <div class="col col-queue pro-only"><span class="${queueClass}">${escapeHtml(queueName)}</span></div>
    <div class="col col-conn pro-only ltr-num">${task.connections || 16}</div>
    <div class="col col-reorder pro-only">
      <button class="reorder-btn btn-order-up" data-id="${task.id}" title="انتقال به بالا">▲</button>
      <button class="reorder-btn btn-order-down" data-id="${task.id}" title="انتقال به پایین">▼</button>
    </div>
  `;
}

function checkTaskCompletions(tasks) {
  if (!Array.isArray(tasks)) return;
  for (const t of tasks) {
    const prev = previousTaskStatuses.get(t.id);
    if (prev && prev !== 'completed' && t.status === 'completed') {
      playCompletionChime();
    }
    previousTaskStatuses.set(t.id, t.status);
  }
}

// --- 7. Event Source (SSE) & REST Polling ---
function initSSE() {
  const evtSource = new EventSource('/api/events');

  evtSource.addEventListener('tasks', (e) => {
    try {
      const data = JSON.parse(e.data);
      if (Array.isArray(data.tasks)) {
        checkTaskCompletions(data.tasks);
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
      if (Array.isArray(data.tasks)) {
        checkTaskCompletions(data.tasks);
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
tasksGridBody.addEventListener('click', async (e) => {
  const btnUp = e.target.closest('.btn-order-up');
  const btnDown = e.target.closest('.btn-order-down');
  if (btnUp) {
    e.stopPropagation();
    const id = btnUp.dataset.id;
    const task = tasksData.find(x => x.id === id);
    if (task) {
      const newOrder = Math.max(1, (task.order || 1) - 1);
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: id, new_order: newOrder })
      });
      fetchTasksREST();
    }
    return;
  }
  if (btnDown) {
    e.stopPropagation();
    const id = btnDown.dataset.id;
    const task = tasksData.find(x => x.id === id);
    if (task) {
      const newOrder = (task.order || 1) + 1;
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: id, new_order: newOrder })
      });
      fetchTasksREST();
    }
    return;
  }

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
    playStartChime();
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

// --- 10. Context Menu Logic & Global Browser Context Menu Prevention ---
const contextMenu = document.getElementById('contextMenu');
const blankContextMenu = document.getElementById('blankContextMenu');

function hideAllContextMenus() {
  if (contextMenu) contextMenu.classList.add('hidden');
  if (blankContextMenu) blankContextMenu.classList.add('hidden');
}

window.addEventListener('click', hideAllContextMenus);

// Global contextmenu handler preventing default browser context menu everywhere in the app
document.addEventListener('contextmenu', (e) => {
  // Allow default native context menu ONLY on editable text inputs (for Copy/Paste)
  const isEditableInput = e.target.matches('input:not([readonly]), textarea, [contenteditable="true"]') ||
                          e.target.closest('input:not([readonly]), textarea, [contenteditable="true"]');
  if (isEditableInput) {
    hideAllContextMenus();
    return;
  }

  // Prevent browser default popup (Back, Refresh, Save as, Print, Inspect) everywhere
  e.preventDefault();

  const row = e.target.closest('.grid-row');
  if (row) {
    // Right-clicked on an active download row
    if (blankContextMenu) blankContextMenu.classList.add('hidden');
    contextTaskId = row.dataset.id;
    selectedTaskIds.clear();
    selectedTaskIds.add(contextTaskId);
    renderTasksGrid();

    if (contextMenu) {
      contextMenu.classList.remove('hidden');
      let x = e.clientX;
      let y = e.clientY;
      if (x + 185 > window.innerWidth) x = window.innerWidth - 190;
      if (y + 320 > window.innerHeight) y = Math.max(10, window.innerHeight - 325);
      contextMenu.style.left = `${x}px`;
      contextMenu.style.top = `${y}px`;
    }
    return;
  }

  // Check if right-clicked on table empty area or workspace background
  const isTableArea = e.target.closest('.table-container') || e.target.closest('.workspace-layout') || e.target.closest('.categories-tree');
  const isModalOpen = document.querySelector('.modal-overlay:not(.hidden)');

  if (isTableArea && !isModalOpen && blankContextMenu) {
    if (contextMenu) contextMenu.classList.add('hidden');
    blankContextMenu.classList.remove('hidden');
    let x = e.clientX;
    let y = e.clientY;
    if (x + 185 > window.innerWidth) x = window.innerWidth - 190;
    if (y + 240 > window.innerHeight) y = Math.max(10, window.innerHeight - 245);
    blankContextMenu.style.left = `${x}px`;
    blankContextMenu.style.top = `${y}px`;
    return;
  }

  // Anywhere else: simply close our menus (default browser menu is already prevented)
  hideAllContextMenus();
});

if (blankContextMenu) {
  blankContextMenu.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-cm-blank]');
    if (!item) return;
    const action = item.dataset.cmBlank;
    hideAllContextMenus();

    if (action === 'add') {
      openAddModal();
    } else if (action === 'batch' && typeof openBatchModal === 'function') {
      openBatchModal();
    } else if (action === 'resume_all') {
      playStartChime();
      await fetch('/api/tasks/start-all', { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'pause_all') {
      await fetch('/api/tasks/pause-all', { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'clear') {
      await fetch('/api/tasks/clear-completed', { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'settings' && typeof openSettingsModal === 'function') {
      openSettingsModal();
    }
  });
}

// Prevent browser accelerator shortcuts that can reload or print the desktop app
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault();
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
  }
  if (e.key === 'Escape') {
    hideAllContextMenus();
  }
});

if (contextMenu) {
  contextMenu.addEventListener('click', async (e) => {
    const item = e.target.closest('[data-cm]');
    if (!item || !contextTaskId) return;

    const action = item.dataset.cm;
    const task = tasksData.find(t => t.id === contextTaskId);

    if (action === 'start') {
      playStartChime();
      await fetch(`/api/tasks/start?id=${contextTaskId}`, { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'pause') {
      await fetch(`/api/tasks/pause?id=${contextTaskId}`, { method: 'POST' });
      fetchTasksREST();
    } else if (action === 'refresh_url' && task) {
      openRefreshUrlModal(task);
    } else if (action === 'open') {
      await fetch(`/api/tasks/open?id=${contextTaskId}`, { method: 'POST' });
    } else if (action === 'extract' && task) {
      handleExtractZip(task);
    } else if (action === 'copy' && task) {
      navigator.clipboard.writeText(task.url);
    } else if (action === 'preview' && task) {
      openPreviewModal(task);
    } else if (action === 'share' && task) {
      openShareModal(task);
    } else if (action === 'checksum' && task) {
      openChecksumModal(task);
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
const modalDirInput = document.getElementById('modalDirInput');
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
  if (modalDirInput) {
    modalDirInput.value = appSettings.default_download_dir || '';
    modalDirInput.placeholder = appSettings.default_download_dir || '';
  }
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

async function browseSystemFolder(targetInputElement) {
  try {
    const res = await fetch('/api/dialog/browse-folder');
    if (res.ok) {
      const data = await res.json();
      if (data.path && targetInputElement) {
        targetInputElement.value = data.path;
      }
    }
  } catch (e) {}
}

const btnBrowseModalDir = document.getElementById('btnBrowseModalDir');
if (btnBrowseModalDir) {
  btnBrowseModalDir.addEventListener('click', () => {
    browseSystemFolder(modalDirInput);
  });
}

async function checkUrlTraffic(url) {
  try {
    const res = await fetch(`/api/traffic/check?url=${encodeURIComponent(url)}`);
    if (res.ok) {
      const info = await res.json();
      trafficNotice.classList.remove('hidden');
      const t = translations[currentLang];
      if (info.is_domestic) {
        trafficNoticeTag.className = 'traffic-tag domestic';
        trafficNoticeTag.textContent = t.traffic_notice_domestic;
        trafficNoticeDesc.textContent = `${t.traffic_desc_domestic} (${info.host})`;
      } else {
        trafficNoticeTag.className = 'traffic-tag international';
        trafficNoticeTag.textContent = t.traffic_notice_intl;
        trafficNoticeDesc.textContent = `${t.traffic_desc_intl} (${info.host})`;
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
    const destination_dir = modalDirInput ? modalDirInput.value.trim() : '';
    const connections = parseInt(modalConnsSelect.value, 10) || 16;
    const queue = modalQueueSelect.value || 'main';

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, filename, destination_dir, connections, queue })
      });

      if (res.ok) {
        playStartChime();
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
const schedStopCheck = document.getElementById('schedStopCheck');
const schedShutdownPC = document.getElementById('schedShutdownPC');
const schedSleepPC = document.getElementById('schedSleepPC');
const schedExitApp = document.getElementById('schedExitApp');
const schedMaxConcur = document.getElementById('schedMaxConcur');
let activeSchedTab = 'night';

function initTimeSelectors() {
  const populate = (selectEl, max) => {
    if (!selectEl || selectEl.children.length > 0) return;
    for (let i = 0; i < max; i++) {
      const opt = document.createElement('option');
      const val = i.toString().padStart(2, '0');
      opt.value = val;
      opt.textContent = val;
      selectEl.appendChild(opt);
    }
  };

  const attachWheelScroll = (selectEl, max) => {
    if (!selectEl || selectEl.dataset.wheelBound) return;
    selectEl.dataset.wheelBound = "true";
    selectEl.addEventListener('wheel', (e) => {
      e.preventDefault();
      let current = parseInt(selectEl.value, 10) || 0;
      if (e.deltaY < 0) {
        current = (current + 1) % max;
      } else {
        current = (current - 1 + max) % max;
      }
      selectEl.value = current.toString().padStart(2, '0');
    }, { passive: false });
  };

  const startH = document.getElementById('schedStartHour');
  const stopH = document.getElementById('schedStopHour');
  const startM = document.getElementById('schedStartMin');
  const stopM = document.getElementById('schedStopMin');

  populate(startH, 24);
  populate(stopH, 24);
  populate(startM, 60);
  populate(stopM, 60);

  attachWheelScroll(startH, 24);
  attachWheelScroll(stopH, 24);
  attachWheelScroll(startM, 60);
  attachWheelScroll(stopM, 60);
}

function setTimePickerValue(prefix, timeStr) {
  initTimeSelectors();
  const parts = (timeStr || '00:00').split(':');
  const hEl = document.getElementById(`${prefix}Hour`);
  const mEl = document.getElementById(`${prefix}Min`);
  if (hEl && parts[0] !== undefined) hEl.value = parts[0].padStart(2, '0');
  if (mEl && parts[1] !== undefined) mEl.value = parts[1].padStart(2, '0');
}

function getTimePickerValue(prefix) {
  const hEl = document.getElementById(`${prefix}Hour`);
  const mEl = document.getElementById(`${prefix}Min`);
  const h = hEl ? hEl.value : '00';
  const m = mEl ? mEl.value : '00';
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
}

async function openSchedulerModal() {
  schedulerModal.classList.remove('hidden');
  initTimeSelectors();
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
  initTimeSelectors();
  const qCfg = (activeSchedTab === 'night') ? schedulerConfig.night_queue : schedulerConfig.main_queue;
  if (!qCfg) return;

  schedEnable.checked = qCfg.enabled;
  setTimePickerValue('schedStart', qCfg.start_time || '02:00');
  setTimePickerValue('schedStop', qCfg.stop_time || '07:30');
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
    targetQueue.start_time = schedStartCheck.checked ? getTimePickerValue('schedStart') : '';
    targetQueue.stop_time = schedStopCheck.checked ? getTimePickerValue('schedStop') : '';
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

// Sidebar Toggle Controller (Unified Single Controller)
const btnToggleSidebar = document.getElementById('btnToggleSidebar');
const workspaceLayout = document.querySelector('.workspace-layout');

function setSidebarCollapsed(collapsed) {
  if (!workspaceLayout) return;
  workspaceLayout.classList.toggle('sidebar-collapsed', collapsed);
  localStorage.setItem('vortex_sidebar_collapsed', collapsed ? 'true' : 'false');
  if (btnToggleSidebar) {
    const t = translations[currentLang] || {};
    const titleText = collapsed 
      ? (t.tip_expand_sidebar || (currentLang === 'fa' ? 'نمایش پنل دسته‌بندی‌ها' : 'Show Categories Panel'))
      : (t.tip_toggle_sidebar || (currentLang === 'fa' ? 'کوچک‌سازی پنل' : 'Collapse Panel'));
    btnToggleSidebar.title = titleText;
    btnToggleSidebar.setAttribute('data-i18n-title', collapsed ? 'tip_expand_sidebar' : 'tip_toggle_sidebar');
  }
}

function toggleSidebar() {
  const isCollapsed = workspaceLayout ? workspaceLayout.classList.contains('sidebar-collapsed') : false;
  setSidebarCollapsed(!isCollapsed);
}

if (btnToggleSidebar) {
  btnToggleSidebar.addEventListener('click', toggleSidebar);
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

// --- 16. Custom Download Queues Management ---
const queueModal = document.getElementById('queueModal');
const btnAddQueue = document.getElementById('btnAddQueue');
const closeQueueModal = document.getElementById('closeQueueModal');
const cancelQueueModalBtn = document.getElementById('cancelQueueModalBtn');
const submitCreateQueueBtn = document.getElementById('submitCreateQueueBtn');
const customQueueNameInput = document.getElementById('customQueueNameInput');
const customQueueConcurSelect = document.getElementById('customQueueConcurSelect');

if (btnAddQueue) {
  btnAddQueue.addEventListener('click', () => {
    if (queueModal) {
      queueModal.classList.remove('hidden');
      if (customQueueNameInput) {
        customQueueNameInput.value = '';
        customQueueNameInput.focus();
      }
    }
  });
}

if (closeQueueModal) {
  closeQueueModal.addEventListener('click', () => queueModal.classList.add('hidden'));
}
if (cancelQueueModalBtn) {
  cancelQueueModalBtn.addEventListener('click', () => queueModal.classList.add('hidden'));
}

if (submitCreateQueueBtn) {
  submitCreateQueueBtn.addEventListener('click', async () => {
    const rawName = customQueueNameInput.value.trim();
    if (!rawName) return;
    const qid = 'q_' + Date.now();
    const concur = parseInt(customQueueConcurSelect.value, 10) || 1;

    try {
      await fetch('/api/queues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: qid,
          config: {
            name: rawName,
            max_concurrent: concur,
            enabled: true
          }
        })
      });
      queueModal.classList.add('hidden');
      await loadQueues();
    } catch (e) {
      alert('Error creating queue');
    }
  });
}

async function loadQueues() {
  try {
    const res = await fetch('/api/queues');
    if (res.ok) {
      const data = await res.json();
      customQueues = data.custom_queues || {};
      customQueuesMap = {};
      for (const [qid, qcfg] of Object.entries(customQueues)) {
        customQueuesMap[qid] = qcfg.name || qid;
      }
      renderQueuesUI();
    }
  } catch (e) {}
}

function renderQueuesUI() {
  const container = document.getElementById('queuesContainer');
  if (!container) return;

  // Remove existing dynamic custom nodes
  const existingCustom = container.querySelectorAll('.tree-node[data-custom="true"]');
  existingCustom.forEach(n => n.remove());

  // Also update modalQueueSelect and batchQueueSelect
  const t = translations[currentLang];
  const modalQueueSelect = document.getElementById('modalQueueSelect');
  if (modalQueueSelect) {
    const currentSelectedVal = modalQueueSelect.value || 'main';
    modalQueueSelect.innerHTML = `
      <option value="main">${t.queue_main}</option>
      <option value="night">${t.queue_night}</option>
    `;

    for (const [qid, qcfg] of Object.entries(customQueues)) {
      const opt = document.createElement('option');
      opt.value = qid;
      opt.textContent = qcfg.name || qid;
      modalQueueSelect.appendChild(opt);
    }
    modalQueueSelect.value = currentSelectedVal;
  }

  const batchQueueSelect = document.getElementById('batchQueueSelect');
  if (batchQueueSelect) {
    const curBatchVal = batchQueueSelect.value || 'main';
    batchQueueSelect.innerHTML = `
      <option value="main">${t.queue_main}</option>
      <option value="night">${t.queue_night}</option>
    `;
    for (const [qid, qcfg] of Object.entries(customQueues)) {
      const opt = document.createElement('option');
      opt.value = qid;
      opt.textContent = qcfg.name || qid;
      batchQueueSelect.appendChild(opt);
    }
    batchQueueSelect.value = curBatchVal;
  }

  for (const [qid, qcfg] of Object.entries(customQueues)) {
    const node = document.createElement('div');
    node.className = 'tree-node sub-node';
    if (activeFilter === `queue-${qid}`) node.classList.add('active');
    node.dataset.filter = `queue-${qid}`;
    node.dataset.custom = 'true';
    node.innerHTML = `
      <svg class="tree-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
      <span class="tree-label">${escapeHtml(qcfg.name || qid)}</span>
      <button class="queue-delete-btn" data-qid="${qid}" title="حذف صف">✖</button>
    `;

    node.addEventListener('click', (e) => {
      if (e.target.closest('.queue-delete-btn')) return;
      document.querySelectorAll('.tree-node').forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      activeFilter = `queue-${qid}`;
      renderTasksGrid();
    });

    const delBtn = node.querySelector('.queue-delete-btn');
    delBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (confirm(`آیا از حذف صف «${qcfg.name || qid}» اطمینان دارید؟`)) {
        await fetch(`/api/queues?id=${encodeURIComponent(qid)}`, { method: 'DELETE' });
        if (activeFilter === `queue-${qid}`) {
          activeFilter = 'all';
          const allNode = document.querySelector('.tree-node[data-filter="all"]');
          if (allNode) allNode.classList.add('active');
        }
        await loadQueues();
        renderTasksGrid();
      }
    });

    container.appendChild(node);
  }
}

// --- 17. Internet Traffic & Bandwidth Usage Analytics ---
const analyticsModal = document.getElementById('analyticsModal');
const tbAnalytics = document.getElementById('tbAnalytics');
const closeAnalyticsModal = document.getElementById('closeAnalyticsModal');
const btnResetCycle = document.getElementById('btnResetCycle');
const chartTabHourly = document.getElementById('chartTabHourly');
const chartTabDaily = document.getElementById('chartTabDaily');
const analyticsChartCanvas = document.getElementById('analyticsChartCanvas');
let analyticsView = 'hourly';
let currentAnalyticsData = null;

if (tbAnalytics) {
  tbAnalytics.addEventListener('click', () => {
    if (analyticsModal) {
      analyticsModal.classList.remove('hidden');
      fetchAnalytics();
    }
  });
}

if (closeAnalyticsModal) {
  closeAnalyticsModal.addEventListener('click', () => {
    if (analyticsModal) analyticsModal.classList.add('hidden');
  });
}

if (btnResetCycle) {
  btnResetCycle.addEventListener('click', async () => {
    if (confirm('آیا از صفر کردن آمار مصرف و شروع دوره جدید اطمینان دارید؟')) {
      await fetch('/api/analytics/reset', { method: 'POST' });
      fetchAnalytics();
    }
  });
}

if (chartTabHourly) {
  chartTabHourly.addEventListener('click', () => {
    chartTabHourly.classList.add('active');
    if (chartTabDaily) chartTabDaily.classList.remove('active');
    analyticsView = 'hourly';
    renderAnalyticsChart();
  });
}

if (chartTabDaily) {
  chartTabDaily.addEventListener('click', () => {
    chartTabDaily.classList.add('active');
    if (chartTabHourly) chartTabHourly.classList.remove('active');
    analyticsView = 'daily';
    renderAnalyticsChart();
  });
}

async function fetchAnalytics() {
  try {
    const res = await fetch('/api/analytics');
    if (res.ok) {
      currentAnalyticsData = await res.json();
      populateAnalyticsUI();
    }
  } catch (e) {}
}

function populateAnalyticsUI() {
  if (!currentAnalyticsData) return;
  const d = currentAnalyticsData;

  const statTotal = document.getElementById('statTotalTraffic');
  const statDom = document.getElementById('statDomesticTraffic');
  const statIntl = document.getElementById('statIntlTraffic');
  const statSaved = document.getElementById('statSavedTraffic');
  const cyclePeriod = document.getElementById('analyticsCyclePeriod');

  if (statTotal) statTotal.textContent = formatBytes(d.total_bytes || 0);
  if (statDom) statDom.textContent = formatBytes(d.domestic_bytes || 0);
  if (statIntl) statIntl.textContent = formatBytes(d.international_bytes || 0);
  if (statSaved) statSaved.textContent = formatBytes(d.saved_bytes || 0);

  if (cyclePeriod && d.cycle_start) {
    const dateStr = new Date(d.cycle_start).toLocaleDateString(currentLang === 'fa' ? 'fa-IR' : 'en-US');
    cyclePeriod.textContent = `دوره: از ${dateStr}`;
  }

  renderAnalyticsChart();
  renderAnalyticsLogs();
}

function renderAnalyticsChart() {
  if (!analyticsChartCanvas || !currentAnalyticsData) return;
  const ctx = analyticsChartCanvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = analyticsChartCanvas.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return;

  analyticsChartCanvas.width = rect.width * dpr;
  analyticsChartCanvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  ctx.clearRect(0, 0, w, h);

  const isHourly = analyticsView === 'hourly';
  const buckets = isHourly ? (currentAnalyticsData.hourly || []) : (currentAnalyticsData.daily || []);
  if (buckets.length === 0) return;

  const maxVal = Math.max(...buckets.map(b => b.total || 0), 10 * 1024 * 1024);
  const bottomPad = 26;
  const topPad = 22;
  const chartH = h - bottomPad - topPad;
  const spacing = w / buckets.length;
  const barWidth = Math.max(6, Math.min(22, spacing * 0.58));

  // Horizontal Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, topPad);
  ctx.lineTo(w, topPad);
  ctx.moveTo(0, topPad + chartH / 2);
  ctx.lineTo(w, topPad + chartH / 2);
  ctx.moveTo(0, h - bottomPad);
  ctx.lineTo(w, h - bottomPad);
  ctx.stroke();

  buckets.forEach((b, i) => {
    const total = b.total || 0;
    const dom = b.domestic || 0;
    const intl = b.international || 0;

    const x = i * spacing + (spacing - barWidth) / 2;
    const totalH = (total / maxVal) * chartH;
    const domH = total > 0 ? (dom / total) * totalH : 0;
    const intlH = totalH - domH;
    const baseY = h - bottomPad;

    // Background placeholder if 0
    if (total === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.fillRect(x, baseY - 2, barWidth, 2);
    } else {
      if (currentLang === 'en') {
        // Clean neon cyan bar for international users
        ctx.fillStyle = '#00f2fe';
        ctx.fillRect(x, baseY - totalH, barWidth, totalH);
      } else {
        // Iranian Domestic (Emerald) vs International (Amber) split
        if (intlH > 0) {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(x, baseY - totalH, barWidth, intlH);
        }
        if (domH > 0) {
          ctx.fillStyle = '#10b981';
          ctx.fillRect(x, baseY - domH, barWidth, domH);
        }
      }
    }

    // X-axis label
    const showLabel = isHourly ? (i % 3 === 0 || i === buckets.length - 1) : (i % 2 === 0 || i === buckets.length - 1);
    if (showLabel) {
      ctx.fillStyle = '#64748b';
      ctx.font = '9px Vazirmatn, JetBrains Mono, sans-serif';
      ctx.textAlign = 'center';
      const labelText = isHourly ? (b.hour || '') : (b.date || '');
      ctx.fillText(labelText, x + barWidth / 2, h - 8);
    }
  });
}

function renderAnalyticsLogs() {
  const tbody = document.getElementById('analyticsLogsBody');
  if (!tbody || !currentAnalyticsData) return;
  const logs = currentAnalyticsData.recent_logs || [];

  if (logs.length === 0) {
    const t = translations[currentLang];
    tbody.innerHTML = `<tr><td colspan="4" class="empty-cell">${t.analytics_no_logs}</td></tr>`;
    return;
  }

  tbody.innerHTML = logs.slice(0, 50).map(l => {
    const isDom = l.is_domestic;
    const badgeClass = isDom ? 'traffic-badge domestic' : 'traffic-badge international';
    const badgeText = isDom ? '🟢 نیم‌بها' : '🌐 تمام‌بها';
    const timeStr = new Date(l.timestamp).toLocaleString(currentLang === 'fa' ? 'fa-IR' : 'en-US', {
      month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    return `
      <tr>
        <td title="${escapeHtml(l.filename)}">${escapeHtml(l.filename)}</td>
        <td class="ltr-num">${formatBytes(l.bytes || 0)}</td>
        <td class="iran-only"><span class="${badgeClass}">${badgeText}</span></td>
        <td class="ltr-num">${timeStr}</td>
      </tr>
    `;
  }).join('');
}

window.addEventListener('resize', () => {
  if (analyticsModal && !analyticsModal.classList.contains('hidden')) {
    renderAnalyticsChart();
  }
});

// --- 18. Batch Multi-URL Downloader ---
const batchModal = document.getElementById('batchModal');
const tbBatch = document.getElementById('tbBatch');
const closeBatchModal = document.getElementById('closeBatchModal');
const cancelBatchModalBtn = document.getElementById('cancelBatchModalBtn');
const submitBatchModalBtn = document.getElementById('submitBatchModalBtn');
const batchUrlsInput = document.getElementById('batchUrlsInput');
const batchQueueSelect = document.getElementById('batchQueueSelect');
const batchConnectionsSelect = document.getElementById('batchConnectionsSelect');
const batchAutoStart = document.getElementById('batchAutoStart');
const batchStatusMsg = document.getElementById('batchStatusMsg');

function openBatchModal() {
  if (!batchModal) return;
  batchModal.classList.remove('hidden');
  if (batchUrlsInput) {
    batchUrlsInput.value = '';
    batchUrlsInput.focus();
  }
  if (batchStatusMsg) {
    batchStatusMsg.className = 'form-status-msg hidden';
    batchStatusMsg.textContent = '';
  }
}

if (tbBatch) tbBatch.addEventListener('click', openBatchModal);
if (closeBatchModal) closeBatchModal.addEventListener('click', () => batchModal.classList.add('hidden'));
if (cancelBatchModalBtn) cancelBatchModalBtn.addEventListener('click', () => batchModal.classList.add('hidden'));

if (submitBatchModalBtn) {
  submitBatchModalBtn.addEventListener('click', async () => {
    const rawText = batchUrlsInput.value.trim();
    if (!rawText) {
      batchUrlsInput.focus();
      return;
    }

    const urls = rawText.split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0 && (u.startsWith('http://') || u.startsWith('https://')));

    if (urls.length === 0) {
      batchStatusMsg.className = 'form-status-msg error';
      batchStatusMsg.textContent = (currentLang === 'fa')
        ? 'هیچ نشانی معتبری با پیشوند http:// یا https:// یافت نشد.'
        : 'No valid URLs found starting with http:// or https://.';
      batchStatusMsg.classList.remove('hidden');
      return;
    }

    submitBatchModalBtn.disabled = true;
    submitBatchModalBtn.textContent = (currentLang === 'fa') ? 'در حال افزودن...' : 'Importing...';

    try {
      const res = await fetch('/api/tasks/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls: urls,
          queue: batchQueueSelect ? (batchQueueSelect.value || 'main') : 'main',
          connections: batchConnectionsSelect ? (parseInt(batchConnectionsSelect.value, 10) || 8) : 8,
          start: batchAutoStart ? batchAutoStart.checked : true
        })
      });

      if (res.ok) {
        batchModal.classList.add('hidden');
        fetchTasksREST();
      } else {
        const errData = await res.json();
        batchStatusMsg.className = 'form-status-msg error';
        batchStatusMsg.textContent = errData.error || 'Failed to import URLs';
        batchStatusMsg.classList.remove('hidden');
      }
    } catch (e) {
      batchStatusMsg.className = 'form-status-msg error';
      batchStatusMsg.textContent = 'Connection error';
      batchStatusMsg.classList.remove('hidden');
    } finally {
      submitBatchModalBtn.disabled = false;
      submitBatchModalBtn.textContent = translations[currentLang].batch_btn_import;
    }
  });
}

// --- 19. Checksum Integrity Verifier ---
const checksumModal = document.getElementById('checksumModal');
const closeChecksumModal = document.getElementById('closeChecksumModal');
const closeChecksumBtn = document.getElementById('closeChecksumBtn');
const csFileName = document.getElementById('csFileName');
const csSha256Val = document.getElementById('csSha256Val');
const csMd5Val = document.getElementById('csMd5Val');
const csVerifyInput = document.getElementById('csVerifyInput');
const csVerifyResult = document.getElementById('csVerifyResult');
const btnCopySha256 = document.getElementById('btnCopySha256');
const btnCopyMd5 = document.getElementById('btnCopyMd5');

async function openChecksumModal(task) {
  if (!checksumModal || !task) return;
  checksumModal.classList.remove('hidden');
  if (csFileName) csFileName.textContent = task.filename || task.id;
  if (csSha256Val) csSha256Val.value = (currentLang === 'fa') ? 'در حال محاسبه هش...' : 'Calculating hash...';
  if (csMd5Val) csMd5Val.value = (currentLang === 'fa') ? 'در حال محاسبه هش...' : 'Calculating hash...';
  if (csVerifyInput) csVerifyInput.value = '';
  if (csVerifyResult) {
    csVerifyResult.className = 'cs-result-banner hidden';
    csVerifyResult.textContent = '';
  }

  try {
    const res = await fetch(`/api/tasks/checksum?id=${encodeURIComponent(task.id)}`);
    if (res.ok) {
      const data = await res.json();
      if (csSha256Val) csSha256Val.value = data.sha256 || '';
      if (csMd5Val) csMd5Val.value = data.md5 || '';
    } else {
      const err = await res.json();
      if (csSha256Val) csSha256Val.value = err.error || 'Error';
      if (csMd5Val) csMd5Val.value = err.error || 'Error';
    }
  } catch (e) {
    if (csSha256Val) csSha256Val.value = 'Failed to load checksum';
    if (csMd5Val) csMd5Val.value = 'Failed to load checksum';
  }
}

function checkExpectedChecksum() {
  if (!csVerifyInput || !csVerifyResult) return;
  const entered = csVerifyInput.value.trim().toLowerCase();
  if (!entered) {
    csVerifyResult.className = 'cs-result-banner hidden';
    csVerifyResult.textContent = '';
    return;
  }
  const currentSha = (csSha256Val ? csSha256Val.value : '').trim().toLowerCase();
  const currentMd5 = (csMd5Val ? csMd5Val.value : '').trim().toLowerCase();

  const t = translations[currentLang];
  if (entered === currentSha || entered === currentMd5) {
    csVerifyResult.className = 'cs-result-banner cs-match';
    csVerifyResult.textContent = t.cs_match_msg;
  } else {
    csVerifyResult.className = 'cs-result-banner cs-mismatch';
    csVerifyResult.textContent = t.cs_mismatch_msg;
  }
}

if (csVerifyInput) {
  csVerifyInput.addEventListener('input', checkExpectedChecksum);
}

if (btnCopySha256 && csSha256Val) {
  btnCopySha256.addEventListener('click', () => {
    navigator.clipboard.writeText(csSha256Val.value);
    btnCopySha256.textContent = '✔️';
    setTimeout(() => { btnCopySha256.textContent = '📋'; }, 1500);
  });
}

if (btnCopyMd5 && csMd5Val) {
  btnCopyMd5.addEventListener('click', () => {
    navigator.clipboard.writeText(csMd5Val.value);
    btnCopyMd5.textContent = '✔️';
    setTimeout(() => { btnCopyMd5.textContent = '📋'; }, 1500);
  });
}

if (closeChecksumModal) closeChecksumModal.addEventListener('click', () => checksumModal.classList.add('hidden'));
if (closeChecksumBtn) closeChecksumBtn.addEventListener('click', () => checksumModal.classList.add('hidden'));

// --- 20. Clipboard Auto-Sniffing with Floating Prompt ---
const clipboardToast = document.getElementById('clipboardToast');
const toastClipUrl = document.getElementById('toastClipUrl');
const toastBtnDownload = document.getElementById('toastBtnDownload');
const toastBtnDismiss = document.getElementById('toastBtnDismiss');
let lastSniffedUrl = '';
let sniffTimeout = null;

const downloadableExts = [
  '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2', '.xz',
  '.iso', '.img', '.dmg',
  '.exe', '.msi', '.apk', '.deb', '.rpm', '.appimage',
  '.mp4', '.mkv', '.avi', '.mov', '.webm',
  '.mp3', '.flac', '.wav', '.aac', '.m4a',
  '.pdf', '.epub', '.docx', '.xlsx', '.pptx',
  '.bin', '.dat'
];

function isDownloadableUrl(raw) {
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;
    const pathname = parsed.pathname.toLowerCase();
    return downloadableExts.some(ext => pathname.endsWith(ext));
  } catch (e) {
    return false;
  }
}

async function checkClipboardForUrl() {
  if (!document.hasFocus()) return;
  if (!navigator.clipboard || !navigator.clipboard.readText) return;

  try {
    const text = (await navigator.clipboard.readText()).trim();
    if (!text || text === lastSniffedUrl) return;

    if (isDownloadableUrl(text)) {
      lastSniffedUrl = text;
      showClipboardToast(text);
    }
  } catch (e) {
    // Clipboard permission not granted or restricted
  }
}

function showClipboardToast(url) {
  if (!clipboardToast) return;
  if (toastClipUrl) toastClipUrl.textContent = url;
  clipboardToast.classList.remove('hidden');

  if (sniffTimeout) clearTimeout(sniffTimeout);
  sniffTimeout = setTimeout(() => {
    clipboardToast.classList.add('hidden');
  }, 8000);
}

if (toastBtnDismiss) {
  toastBtnDismiss.addEventListener('click', () => {
    if (clipboardToast) clipboardToast.classList.add('hidden');
    if (sniffTimeout) clearTimeout(sniffTimeout);
  });
}

if (toastBtnDownload) {
  toastBtnDownload.addEventListener('click', async () => {
    const url = lastSniffedUrl;
    if (!url) return;
    if (clipboardToast) clipboardToast.classList.add('hidden');
    if (sniffTimeout) clearTimeout(sniffTimeout);

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url, connections: 16 })
      });
      if (res.ok) {
        fetchTasksREST();
      }
    } catch (e) {}
  });
}

window.addEventListener('focus', () => {
  setTimeout(checkClipboardForUrl, 400);
});
document.addEventListener('copy', () => {
  setTimeout(checkClipboardForUrl, 500);
});

// --- 21. ZIP Archive Native Extraction ---
async function handleExtractZip(task) {
  if (!task) return;
  const t = translations[currentLang];
  try {
    const res = await fetch(`/api/tasks/extract?id=${encodeURIComponent(task.id)}`, { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      alert(`${t.extract_success}\n📁 ${data.extracted_to}`);
    } else {
      alert(`${t.extract_err}: ${data.error || 'Failed'}`);
    }
  } catch (e) {
    alert(t.extract_err);
  }
}

// --- 22. Modal: Refresh Expired Download URL ---
const refreshUrlModal = document.getElementById('refreshUrlModal');
const closeRefreshModal = document.getElementById('closeRefreshModal');
const cancelRefreshModalBtn = document.getElementById('cancelRefreshModalBtn');
const submitRefreshModalBtn = document.getElementById('submitRefreshModalBtn');
const refreshModalFileName = document.getElementById('refreshModalFileName');
const refreshModalNewURL = document.getElementById('refreshModalNewURL');
const refreshModalStatus = document.getElementById('refreshModalStatus');
let refreshTaskId = null;

function openRefreshUrlModal(task) {
  if (!refreshUrlModal || !task) return;
  refreshTaskId = task.id;
  if (refreshModalFileName) refreshModalFileName.textContent = task.filename || task.id;
  if (refreshModalNewURL) {
    refreshModalNewURL.value = task.url || '';
    refreshModalNewURL.focus();
  }
  if (refreshModalStatus) {
    refreshModalStatus.className = 'form-status-msg hidden';
    refreshModalStatus.textContent = '';
  }
  refreshUrlModal.classList.remove('hidden');
}

if (closeRefreshModal) closeRefreshModal.addEventListener('click', () => refreshUrlModal.classList.add('hidden'));
if (cancelRefreshModalBtn) cancelRefreshModalBtn.addEventListener('click', () => refreshUrlModal.classList.add('hidden'));

if (submitRefreshModalBtn) {
  submitRefreshModalBtn.addEventListener('click', async () => {
    if (!refreshTaskId) return;
    const newURL = refreshModalNewURL ? refreshModalNewURL.value.trim() : '';
    if (!newURL) return;
    const t = translations[currentLang];

    if (refreshModalStatus) {
      refreshModalStatus.className = 'form-status-msg';
      refreshModalStatus.textContent = '...';
      refreshModalStatus.classList.remove('hidden');
    }

    try {
      const res = await fetch('/api/tasks/refresh-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: refreshTaskId, new_url: newURL })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (refreshModalStatus) {
          refreshModalStatus.className = 'form-status-msg success';
          refreshModalStatus.textContent = t.refresh_success;
        }
        playStartChime();
        setTimeout(() => {
          refreshUrlModal.classList.add('hidden');
          fetchTasksREST();
        }, 1200);
      } else {
        if (refreshModalStatus) {
          refreshModalStatus.className = 'form-status-msg error';
          refreshModalStatus.textContent = data.error || 'Failed to update URL';
        }
      }
    } catch (e) {
      if (refreshModalStatus) {
        refreshModalStatus.className = 'form-status-msg error';
        refreshModalStatus.textContent = 'Connection error';
      }
    }
  });
}

// --- 23. Modal: Application Settings ---
const settingsModal = document.getElementById('settingsModal');
const tbSettings = document.getElementById('tbSettings');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const cancelSettingsModalBtn = document.getElementById('cancelSettingsModalBtn');
const saveSettingsModalBtn = document.getElementById('saveSettingsModalBtn');
const settingDefaultDirInput = document.getElementById('settingDefaultDirInput');
const btnBrowseSettingDir = document.getElementById('btnBrowseSettingDir');
const settingDefaultModeSelect = document.getElementById('settingDefaultModeSelect');
const settingSoundToggle = document.getElementById('settingSoundToggle');
const settingAutoExtractToggle = document.getElementById('settingAutoExtractToggle');
const settingProxyToggle = document.getElementById('settingProxyToggle');
const proxySettingsSection = document.getElementById('proxySettingsSection');
const settingProxyType = document.getElementById('settingProxyType');
const settingProxyAddr = document.getElementById('settingProxyAddr');
const settingProxyBypassDomestic = document.getElementById('settingProxyBypassDomestic');
const settingsStatusMsg = document.getElementById('settingsStatusMsg');

if (btnBrowseSettingDir) {
  btnBrowseSettingDir.addEventListener('click', () => {
    browseSystemFolder(settingDefaultDirInput);
  });
}

if (settingProxyToggle && proxySettingsSection) {
  settingProxyToggle.addEventListener('change', () => {
    proxySettingsSection.classList.toggle('hidden', !settingProxyToggle.checked);
  });
}

async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const data = await res.json();
      appSettings = {
        default_download_dir: data.default_download_dir || '',
        default_ui_mode: data.default_ui_mode || 'simple',
        sound_enabled: data.sound_enabled !== false,
        auto_extract_zip: data.auto_extract_zip !== false,
        proxy_enabled: !!data.proxy_enabled,
        proxy_type: data.proxy_type || 'socks5',
        proxy_address: data.proxy_address || '',
        proxy_bypass_domestic: data.proxy_bypass_domestic !== false
      };

      const savedMode = localStorage.getItem('vortex_ui_mode') || appSettings.default_ui_mode || 'simple';
      setUIMode(savedMode, false);
    }
  } catch (e) {
    console.warn('Could not load settings', e);
  }
}

function openSettingsModal() {
  if (!settingsModal) return;
  if (settingDefaultDirInput) settingDefaultDirInput.value = appSettings.default_download_dir || '';
  if (settingDefaultModeSelect) settingDefaultModeSelect.value = appSettings.default_ui_mode || 'simple';
  if (settingSoundToggle) settingSoundToggle.checked = appSettings.sound_enabled;
  if (settingAutoExtractToggle) settingAutoExtractToggle.checked = appSettings.auto_extract_zip;
  if (settingProxyToggle) {
    settingProxyToggle.checked = !!appSettings.proxy_enabled;
    if (proxySettingsSection) {
      proxySettingsSection.classList.toggle('hidden', !settingProxyToggle.checked);
    }
  }
  if (settingProxyType) settingProxyType.value = appSettings.proxy_type || 'socks5';
  if (settingProxyAddr) settingProxyAddr.value = appSettings.proxy_address || '';
  if (settingProxyBypassDomestic) settingProxyBypassDomestic.checked = appSettings.proxy_bypass_domestic !== false;

  if (settingsStatusMsg) {
    settingsStatusMsg.className = 'form-status-msg hidden';
    settingsStatusMsg.textContent = '';
  }
  settingsModal.classList.remove('hidden');
}

if (tbSettings) tbSettings.addEventListener('click', openSettingsModal);
if (closeSettingsModal) closeSettingsModal.addEventListener('click', () => settingsModal.classList.add('hidden'));
if (cancelSettingsModalBtn) cancelSettingsModalBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));

if (saveSettingsModalBtn) {
  saveSettingsModalBtn.addEventListener('click', async () => {
    const defaultDir = settingDefaultDirInput ? settingDefaultDirInput.value.trim() : '';
    const defaultMode = settingDefaultModeSelect ? settingDefaultModeSelect.value : 'simple';
    const soundEnabled = settingSoundToggle ? settingSoundToggle.checked : true;
    const autoExtract = settingAutoExtractToggle ? settingAutoExtractToggle.checked : true;
    const proxyEnabled = settingProxyToggle ? settingProxyToggle.checked : false;
    const proxyType = settingProxyType ? settingProxyType.value : 'socks5';
    const proxyAddr = settingProxyAddr ? settingProxyAddr.value.trim() : '';
    const proxyBypass = settingProxyBypassDomestic ? settingProxyBypassDomestic.checked : true;

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          default_download_dir: defaultDir,
          default_ui_mode: defaultMode,
          sound_enabled: soundEnabled,
          auto_extract_zip: autoExtract,
          proxy_enabled: proxyEnabled,
          proxy_type: proxyType,
          proxy_address: proxyAddr,
          proxy_bypass_domestic: proxyBypass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        appSettings.default_download_dir = defaultDir;
        appSettings.default_ui_mode = defaultMode;
        appSettings.sound_enabled = soundEnabled;
        appSettings.auto_extract_zip = autoExtract;
        appSettings.proxy_enabled = proxyEnabled;
        appSettings.proxy_type = proxyType;
        appSettings.proxy_address = proxyAddr;
        appSettings.proxy_bypass_domestic = proxyBypass;

        setUIMode(defaultMode, true);

        const t = translations[currentLang];
        if (settingsStatusMsg) {
          settingsStatusMsg.className = 'form-status-msg success';
          settingsStatusMsg.textContent = t.settings_saved;
          settingsStatusMsg.classList.remove('hidden');
        }
        setTimeout(() => {
          settingsModal.classList.add('hidden');
        }, 1000);
      } else {
        if (settingsStatusMsg) {
          settingsStatusMsg.className = 'form-status-msg error';
          settingsStatusMsg.textContent = data.error || 'Failed to save settings';
          settingsStatusMsg.classList.remove('hidden');
        }
      }
    } catch (e) {
      if (settingsStatusMsg) {
        settingsStatusMsg.className = 'form-status-msg error';
        settingsStatusMsg.textContent = 'Connection error';
        settingsStatusMsg.classList.remove('hidden');
      }
    }
  });
}

// --- 24. Standalone Offline QR Code Matrix Generator ---
function createQRCodeMatrix(text) {
  const PAD0 = 0xEC;
  const PAD1 = 0x11;
  const EXP_TABLE = new Uint8Array(256);
  const LOG_TABLE = new Uint8Array(256);
  for (let i = 0, x = 1; i < 256; i++) {
    EXP_TABLE[i] = x;
    LOG_TABLE[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  function glog(n) { if (n < 1) return 0; return LOG_TABLE[n]; }
  function gexp(n) { while (n < 0) n += 255; while (n >= 255) n -= 255; return EXP_TABLE[n]; }

  function getErrorCorrectionPolynomial(ecLen) {
    let a = [1];
    for (let i = 0; i < ecLen; i++) {
      let b = [1, gexp(i)];
      let c = new Array(a.length + b.length - 1).fill(0);
      for (let j = 0; j < a.length; j++) {
        for (let k = 0; k < b.length; k++) {
          if (a[j] && b[k]) c[j + k] ^= gexp(glog(a[j]) + glog(b[k]));
        }
      }
      a = c;
    }
    return a;
  }

  const VERSION_SPECS = [
    null,
    { total: 26, ec: 7, blocks: 1 },
    { total: 44, ec: 10, blocks: 1 },
    { total: 70, ec: 15, blocks: 1 },
    { total: 100, ec: 20, blocks: 1 },
    { total: 134, ec: 26, blocks: 1 },
    { total: 172, ec: 18, blocks: 2 },
    { total: 196, ec: 20, blocks: 2 },
    { total: 242, ec: 24, blocks: 2 },
    { total: 292, ec: 30, blocks: 2 },
    { total: 346, ec: 18, blocks: 4 }
  ];

  const ALIGN_POS = [
    [], [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
    [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
  ];

  const utf8Bytes = [];
  for (let i = 0; i < text.length; i++) {
    let c = text.charCodeAt(i);
    if (c < 128) utf8Bytes.push(c);
    else if (c < 2048) { utf8Bytes.push(192 | (c >> 6)); utf8Bytes.push(128 | (c & 63)); }
    else if (c < 65536) { utf8Bytes.push(224 | (c >> 12)); utf8Bytes.push(128 | ((c >> 6) & 63)); utf8Bytes.push(128 | (c & 63)); }
  }

  let version = 1;
  let totalDataCodewords = 0;
  for (; version <= 10; version++) {
    const spec = VERSION_SPECS[version];
    totalDataCodewords = spec.total - (spec.ec * spec.blocks);
    const headerBits = 4 + (version < 10 ? 8 : 16);
    if (Math.ceil((headerBits + utf8Bytes.length * 8) / 8) <= totalDataCodewords) break;
  }
  if (version > 10) version = 10;

  const spec = VERSION_SPECS[version];
  const ecPerBlock = spec.ec;
  const numBlocks = spec.blocks;
  const dataCodewords = spec.total - (ecPerBlock * numBlocks);

  class BitBuf {
    constructor() { this.buf = []; this.len = 0; }
    put(n, l) {
      for (let i = 0; i < l; i++) this.putBit(((n >>> (l - i - 1)) & 1) === 1);
    }
    putBit(b) {
      const idx = Math.floor(this.len / 8);
      if (this.buf.length <= idx) this.buf.push(0);
      if (b) this.buf[idx] |= (0x80 >>> (this.len % 8));
      this.len++;
    }
  }

  const bb = new BitBuf();
  bb.put(0x04, 4);
  bb.put(utf8Bytes.length, version < 10 ? 8 : 16);
  for (let b of utf8Bytes) bb.put(b, 8);
  for (let i = 0; i < 4 && bb.len < dataCodewords * 8; i++) bb.putBit(false);
  while (bb.len % 8 !== 0) bb.putBit(false);
  let pIdx = 0;
  while (bb.len < dataCodewords * 8) {
    bb.put(pIdx % 2 === 0 ? PAD0 : PAD1, 8);
    pIdx++;
  }

  const blockSize = Math.floor(dataCodewords / numBlocks);
  const remainder = dataCodewords % numBlocks;
  const blocks = [];
  let byteOffset = 0;
  for (let b = 0; b < numBlocks; b++) {
    const curBlockLen = blockSize + (b >= numBlocks - remainder ? 1 : 0);
    const dataPart = bb.buf.slice(byteOffset, byteOffset + curBlockLen);
    byteOffset += curBlockLen;

    const rsPoly = getErrorCorrectionPolynomial(ecPerBlock);
    const rawData = dataPart.slice();
    const ecPart = new Array(ecPerBlock).fill(0);
    const poly = rawData.concat(ecPart);

    for (let i = 0; i < dataPart.length; i++) {
      const coef = poly[i];
      if (coef !== 0) {
        const logVal = glog(coef);
        for (let j = 0; j < rsPoly.length; j++) {
          poly[i + j] ^= gexp(logVal + glog(rsPoly[j]));
        }
      }
    }
    blocks.push({ data: dataPart, ec: poly.slice(dataPart.length) });
  }

  const finalCodewords = [];
  const maxDataLen = Math.max(...blocks.map(b => b.data.length));
  for (let i = 0; i < maxDataLen; i++) {
    for (let b = 0; b < numBlocks; b++) {
      if (i < blocks[b].data.length) finalCodewords.push(blocks[b].data[i]);
    }
  }
  for (let i = 0; i < ecPerBlock; i++) {
    for (let b = 0; b < numBlocks; b++) {
      finalCodewords.push(blocks[b].ec[i]);
    }
  }

  const moduleCount = version * 4 + 17;
  const modules = Array.from({ length: moduleCount }, () => new Array(moduleCount).fill(null));
  const isFunc = Array.from({ length: moduleCount }, () => new Array(moduleCount).fill(false));

  function setM(r, c, v, func = true) {
    if (r >= 0 && r < moduleCount && c >= 0 && c < moduleCount) {
      modules[r][c] = v;
      if (func) isFunc[r][c] = true;
    }
  }

  function drawFinder(row, col) {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const tr = row + r;
        const tc = col + c;
        if (tr < 0 || tr >= moduleCount || tc < 0 || tc >= moduleCount) continue;
        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
          setM(tr, tc, r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        } else {
          setM(tr, tc, false);
        }
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, moduleCount - 7);
  drawFinder(moduleCount - 7, 0);

  const align = ALIGN_POS[version] || [];
  for (let r of align) {
    for (let c of align) {
      if (isFunc[r][c]) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          setM(r + dr, c + dc, Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0));
        }
      }
    }
  }

  for (let i = 8; i < moduleCount - 8; i++) {
    if (!isFunc[6][i]) setM(6, i, i % 2 === 0);
    if (!isFunc[i][6]) setM(i, 6, i % 2 === 0);
  }

  setM(4 * version + 9, 8, true);

  const FORMAT_BITS = 0x77C4;
  for (let i = 0; i < 15; i++) {
    const bit = ((FORMAT_BITS >>> (14 - i)) & 1) === 1;
    if (i < 6) setM(i, 8, bit);
    else if (i < 8) setM(i + 1, 8, bit);
    else setM(moduleCount - 15 + i, 8, bit);

    if (i < 8) setM(8, moduleCount - i - 1, bit);
    else if (i === 8) setM(8, 8, bit);
    else setM(8, 14 - i, bit);
  }

  let dir = -1;
  let row = moduleCount - 1;
  let bitIdx = 0;
  const totBits = finalCodewords.length * 8;

  for (let col = moduleCount - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    while (true) {
      for (let c = 0; c < 2; c++) {
        const curCol = col - c;
        if (!isFunc[row][curCol]) {
          let bit = false;
          if (bitIdx < totBits) {
            const byte = finalCodewords[Math.floor(bitIdx / 8)];
            bit = ((byte >>> (7 - (bitIdx % 8))) & 1) === 1;
            bitIdx++;
          }
          const mask = (row + curCol) % 2 === 0;
          modules[row][curCol] = mask ? !bit : bit;
        }
      }
      row += dir;
      if (row < 0 || row >= moduleCount) {
        dir = -dir;
        row += dir;
        break;
      }
    }
  }

  return {
    moduleCount,
    isDark: (r, c) => !!modules[r][c]
  };
}

function drawQRCodeToCanvas(canvas, text) {
  if (!canvas) return;
  const qr = createQRCodeMatrix(text);
  const ctx = canvas.getContext('2d');
  const count = qr.moduleCount;
  const padding = 12;
  const cellSize = Math.floor((canvas.width - padding * 2) / count);
  const offset = Math.floor((canvas.width - cellSize * count) / 2);

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f172a';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(offset + c * cellSize, offset + r * cellSize, cellSize, cellSize);
      }
    }
  }
}

// --- 25. Modal: Wi-Fi Share to Mobile Controller ---
const shareModal = document.getElementById('shareModal');
const closeShareModal = document.getElementById('closeShareModal');
const closeShareModalBtn = document.getElementById('closeShareModalBtn');
const shareQrCanvas = document.getElementById('shareQrCanvas');
const shareUrlInput = document.getElementById('shareUrlInput');
const btnCopyShareUrl = document.getElementById('btnCopyShareUrl');
const shareFileName = document.getElementById('shareFileName');
const shareFileSize = document.getElementById('shareFileSize');

async function openShareModal(task) {
  if (!shareModal || !task) return;
  if (shareFileName) shareFileName.textContent = task.filename || task.id;
  if (shareFileSize) shareFileSize.textContent = formatBytes(task.downloaded_size || task.total_size || 0);

  shareModal.classList.remove('hidden');

  try {
    const res = await fetch(`/api/share/info?id=${task.id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.share_url) {
        if (shareUrlInput) shareUrlInput.value = data.share_url;
        drawQRCodeToCanvas(shareQrCanvas, data.share_url);
      }
    }
  } catch (e) {
    console.warn('Share info failed', e);
  }
}

if (closeShareModal) closeShareModal.addEventListener('click', () => shareModal.classList.add('hidden'));
if (closeShareModalBtn) closeShareModalBtn.addEventListener('click', () => shareModal.classList.add('hidden'));

if (btnCopyShareUrl) {
  btnCopyShareUrl.addEventListener('click', () => {
    if (shareUrlInput && shareUrlInput.value) {
      navigator.clipboard.writeText(shareUrlInput.value);
      const originalText = btnCopyShareUrl.textContent;
      btnCopyShareUrl.textContent = '✓';
      setTimeout(() => { btnCopyShareUrl.textContent = originalText; }, 1200);
    }
  });
}

// --- 26. Modal: In-Flight Media Streaming Preview Controller ---
const previewModal = document.getElementById('previewModal');
const closePreviewModal = document.getElementById('closePreviewModal');
const previewTitle = document.getElementById('previewTitle');
const previewVideoPlayer = document.getElementById('previewVideoPlayer');
const previewAudioPlayer = document.getElementById('previewAudioPlayer');

function openPreviewModal(task) {
  if (!previewModal || !task) return;
  const ext = (task.filename || '').split('.').pop().toLowerCase();
  const videoExts = ['mp4', 'webm', 'mkv', 'mov', 'avi', 'm4v'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'opus'];

  const isVideo = videoExts.includes(ext);
  const isAudio = audioExts.includes(ext);

  if (!isVideo && !isAudio) {
    alert(translations[currentLang].preview_unsupported || 'Unsupported format');
    return;
  }

  if (previewTitle) previewTitle.textContent = task.filename || task.id;

  const streamURL = `/api/media/stream?id=${encodeURIComponent(task.id)}`;

  if (isVideo) {
    if (previewAudioPlayer) {
      previewAudioPlayer.pause();
      previewAudioPlayer.classList.add('hidden');
      previewAudioPlayer.src = '';
    }
    if (previewVideoPlayer) {
      previewVideoPlayer.classList.remove('hidden');
      previewVideoPlayer.src = streamURL;
      previewVideoPlayer.load();
      previewVideoPlayer.play().catch(() => {});
    }
  } else {
    if (previewVideoPlayer) {
      previewVideoPlayer.pause();
      previewVideoPlayer.classList.add('hidden');
      previewVideoPlayer.src = '';
    }
    if (previewAudioPlayer) {
      previewAudioPlayer.classList.remove('hidden');
      previewAudioPlayer.src = streamURL;
      previewAudioPlayer.load();
      previewAudioPlayer.play().catch(() => {});
    }
  }

  previewModal.classList.remove('hidden');
}

function closePreview() {
  if (previewVideoPlayer) {
    previewVideoPlayer.pause();
    previewVideoPlayer.src = '';
  }
  if (previewAudioPlayer) {
    previewAudioPlayer.pause();
    previewAudioPlayer.src = '';
  }
  if (previewModal) previewModal.classList.add('hidden');
}

if (closePreviewModal) closePreviewModal.addEventListener('click', closePreview);

// --- 27. Modal: Built-in Network Speed & Latency Benchmark Controller ---
const speedtestModal = document.getElementById('speedtestModal');
const tbSpeedtest = document.getElementById('tbSpeedtest');
const closeSpeedtestModal = document.getElementById('closeSpeedtestModal');
const btnRunSpeedtest = document.getElementById('btnRunSpeedtest');
const stPingVal = document.getElementById('stPingVal');
const stSpeedVal = document.getElementById('stSpeedVal');
const speedtestStatus = document.getElementById('speedtestStatus');
const speedtestGaugeCanvas = document.getElementById('speedtestGaugeCanvas');

let speedtestRunning = false;

function drawSpeedGauge(valMB, maxMB = 50) {
  if (!speedtestGaugeCanvas) return;
  const ctx = speedtestGaugeCanvas.getContext('2d');
  const w = speedtestGaugeCanvas.width;
  const h = speedtestGaugeCanvas.height;
  const cx = w / 2;
  const cy = h - 15;
  const radius = 80;

  ctx.clearRect(0, 0, w, h);

  // Background Arc
  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, 0, false);
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#1e293b';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Value Arc
  const ratio = Math.min(Math.max(valMB / maxMB, 0), 1);
  const angle = Math.PI + ratio * Math.PI;

  const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy);
  grad.addColorStop(0, '#0284c7');
  grad.addColorStop(0.5, '#06b6d4');
  grad.addColorStop(1, '#10b981');

  ctx.beginPath();
  ctx.arc(cx, cy, radius, Math.PI, angle, false);
  ctx.lineWidth = 12;
  ctx.strokeStyle = grad;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Needle pointer
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(radius - 16, 0);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Center hub
  ctx.beginPath();
  ctx.arc(cx, cy, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
}

function openSpeedtestModal() {
  if (!speedtestModal) return;
  if (stPingVal) stPingVal.textContent = '-- ms';
  if (stSpeedVal) stSpeedVal.textContent = '-- MB/s';
  if (speedtestStatus) {
    speedtestStatus.className = 'form-status-msg hidden';
    speedtestStatus.textContent = '';
  }
  drawSpeedGauge(0);
  speedtestModal.classList.remove('hidden');
}

if (tbSpeedtest) tbSpeedtest.addEventListener('click', openSpeedtestModal);
if (closeSpeedtestModal) closeSpeedtestModal.addEventListener('click', () => {
  if (speedtestModal) speedtestModal.classList.add('hidden');
});

if (btnRunSpeedtest) {
  btnRunSpeedtest.addEventListener('click', async () => {
    if (speedtestRunning) return;
    speedtestRunning = true;
    btnRunSpeedtest.disabled = true;
    const t = translations[currentLang];

    if (speedtestStatus) {
      speedtestStatus.className = 'form-status-msg';
      speedtestStatus.textContent = t.st_testing_ping;
      speedtestStatus.classList.remove('hidden');
    }

    try {
      // Step 1: Real Latency Ping
      const pingRes = await fetch('/api/speedtest/ping');
      const pingData = await pingRes.json();
      if (stPingVal && pingData.ping_ms !== undefined) {
        stPingVal.textContent = `${Math.round(pingData.ping_ms)} ms`;
      }

      // Step 2: Real Download Throughput
      if (speedtestStatus) {
        speedtestStatus.textContent = t.st_testing_speed;
      }

      // Benchmark against real internet speedtest payload
      let speedRes;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);
        speedRes = await fetch('https://speed.cloudflare.com/__down?bytes=5000000', {
          signal: controller.signal,
          cache: 'no-store'
        });
        clearTimeout(timeoutId);
        if (!speedRes.ok) throw new Error('CDN response not ok');
      } catch (cdnErr) {
        // Fallback to backend external proxy stream
        speedRes = await fetch('/api/speedtest/download?real=true');
      }

      const reader = speedRes.body.getReader();
      let bytesReceived = 0;
      const startTime = performance.now();
      let lastUpdate = startTime;
      let maxSpeed = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytesReceived += value.length;

        const now = performance.now();
        if (now - lastUpdate > 100) {
          const elapsedSec = (now - startTime) / 1000;
          const currentSpeedMB = (bytesReceived / (1024 * 1024)) / (elapsedSec || 1);
          if (currentSpeedMB > maxSpeed) maxSpeed = currentSpeedMB;

          if (stSpeedVal) stSpeedVal.textContent = `${currentSpeedMB.toFixed(2)} MB/s`;
          drawSpeedGauge(currentSpeedMB, Math.max(10, Math.ceil(currentSpeedMB * 1.5)));
          lastUpdate = now;
        }
      }

      const totalElapsed = (performance.now() - startTime) / 1000;
      const finalSpeedMB = (bytesReceived / (1024 * 1024)) / (totalElapsed || 1);
      if (stSpeedVal) stSpeedVal.textContent = `${finalSpeedMB.toFixed(2)} MB/s`;
      drawSpeedGauge(finalSpeedMB, Math.max(10, Math.ceil(finalSpeedMB * 1.5)));

      if (speedtestStatus) {
        speedtestStatus.className = 'form-status-msg success';
        speedtestStatus.textContent = t.st_completed;
      }
    } catch (e) {
      if (speedtestStatus) {
        speedtestStatus.className = 'form-status-msg error';
        speedtestStatus.textContent = (currentLang === 'fa') 
          ? 'خطا در اتصال به سرور آزمون سرعت اینترنت'
          : 'Speed test failed: could not connect to benchmark server';
      }
    } finally {
      speedtestRunning = false;
      btnRunSpeedtest.disabled = false;
    }
  });
}

// --- 24. Dual Mode Toggle Handler ---
const btnModeToggle = document.getElementById('btnModeToggle');
if (btnModeToggle) {
  btnModeToggle.addEventListener('click', () => {
    const nextMode = (currentUIMode === 'simple') ? 'pro' : 'simple';
    setUIMode(nextMode, true);
  });
}

// --- 24.1. Toolbar Overflow Popover Menu Handler (Idea 3) ---
const tbOverflowBtn = document.getElementById('tbOverflowBtn');
const toolbarOverflowMenu = document.getElementById('toolbarOverflowMenu');

if (tbOverflowBtn && toolbarOverflowMenu) {
  tbOverflowBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = toolbarOverflowMenu.classList.contains('hidden');
    if (isHidden) {
      const rect = tbOverflowBtn.getBoundingClientRect();
      toolbarOverflowMenu.style.top = `${rect.bottom + 6}px`;
      if (document.documentElement.dir === 'rtl') {
        toolbarOverflowMenu.style.right = `${window.innerWidth - rect.right}px`;
        toolbarOverflowMenu.style.left = 'auto';
      } else {
        toolbarOverflowMenu.style.left = `${rect.left}px`;
        toolbarOverflowMenu.style.right = 'auto';
      }
      toolbarOverflowMenu.classList.remove('hidden');
    } else {
      toolbarOverflowMenu.classList.add('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (toolbarOverflowMenu && !toolbarOverflowMenu.contains(e.target) && e.target !== tbOverflowBtn) {
      toolbarOverflowMenu.classList.add('hidden');
    }
  });

  const overflowActionMap = {
    ovBatch: 'tbBatch',
    ovScheduler: 'tbScheduler',
    ovSpeedLimit: 'tbSpeedLimit',
    ovLinkIrani: 'tbLinkIrani',
    ovAnalytics: 'tbAnalytics',
    ovSpeedtest: 'tbSpeedtest',
    ovSettings: 'tbSettings'
  };

  Object.entries(overflowActionMap).forEach(([ovId, tbId]) => {
    const ovEl = document.getElementById(ovId);
    const tbEl = document.getElementById(tbId);
    if (ovEl && tbEl) {
      ovEl.addEventListener('click', () => {
        toolbarOverflowMenu.classList.add('hidden');
        tbEl.click();
      });
    }
  });
}

// --- Ribbon Toolbar Mouse-Wheel Horizontal Scrolling ---
const toolbarButtonsStrip = document.querySelector('.toolbar-buttons');
if (toolbarButtonsStrip) {
  toolbarButtonsStrip.addEventListener('wheel', (e) => {
    if (e.deltaY !== 0 && e.deltaX === 0) {
      e.preventDefault();
      const isRTL = document.documentElement.dir === 'rtl';
      const scrollAmount = e.deltaY * 0.85;
      if (isRTL) {
        toolbarButtonsStrip.scrollLeft -= scrollAmount;
      } else {
        toolbarButtonsStrip.scrollLeft += scrollAmount;
      }
    }
  }, { passive: false });
}

// --- 25. App Bootstrapping ---
window.addEventListener('DOMContentLoaded', () => {
  const savedSidebarCollapsed = localStorage.getItem('vortex_sidebar_collapsed') === 'true';
  setSidebarCollapsed(savedSidebarCollapsed);
  initTimeSelectors();
  loadQueues();
  loadSettings();
  setLanguage(currentLang);
  setUIMode(currentUIMode, false);
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

