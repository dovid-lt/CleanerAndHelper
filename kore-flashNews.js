const LAST_NEWS_ID_STORAGE_KEY = 'lastNewsID';
const NEW_ITEM_CLASS = 'unread';
const AUTO_MARK_READ_TIME_PER_ITEM = 2800;
const AUTO_MARK_READ_MAX_TIME = 2 * 60 * 1000;
const TIMER_INTERVAL_STEP = 1000;

document.addEventListener('DOMContentLoaded', () => {
  const savedLastRead = parseInt(localStorage.getItem(LAST_NEWS_ID_STORAGE_KEY), 10) || 0;
  const initialUnreadItems = new Set();
  const newsItems = document.querySelectorAll('.newsflash_list .item');
  let newItemsCount = 0;

  newsItems.forEach(item => {
    const itemId = parseInt(item.id, 10);
    if (itemId > savedLastRead) {
      item.classList.add(NEW_ITEM_CLASS);
      initialUnreadItems.add(itemId);
      newItemsCount++;
    }
  });

  let remainingTime = Math.min(newItemsCount * AUTO_MARK_READ_TIME_PER_ITEM, AUTO_MARK_READ_MAX_TIME);
  let timerInterval;

  const extraButtonsContainer = document.createElement('div');
  extraButtonsContainer.style.display = 'flex';
  extraButtonsContainer.style.alignItems = 'center';
  extraButtonsContainer.style.gap = '5px';

  const markAsReadButton = document.createElement('span');
  markAsReadButton.textContent = 'סמן הכל כנקרא';
  markAsReadButton.style.cursor = 'pointer';

  const countdownElement = document.createElement('span');
  countdownElement.style.display = 'none';

  const markBackAsUnreadButton = document.createElement('span');
  markBackAsUnreadButton.textContent = ' (סמן חזרה כלא נקרא)';
  markBackAsUnreadButton.style.cursor = 'pointer';
  markBackAsUnreadButton.style.display = 'none';

  const separator1 = document.createElement('span');
  separator1.textContent = '|';
  separator1.style.margin = '0 5px';

  const markAsUnreadButton = document.createElement('span');
  markAsUnreadButton.textContent = 'סמן הכל כלא נקרא';
  markAsUnreadButton.style.cursor = 'pointer';

  const updateCountdown = () => {
    const seconds = Math.ceil(remainingTime / 1000);
    countdownElement.textContent = `(סימון אוטומטי בעוד ${seconds} שניות)`;
  };

  const startTimer = () => {
    if (newItemsCount > 0) {
      updateCountdown();
      countdownElement.style.display = 'inline';
      markBackAsUnreadButton.style.display = 'none';
      timerInterval = setInterval(() => {
        remainingTime -= TIMER_INTERVAL_STEP;
        updateCountdown();
        if (remainingTime <= 0) {
          clearInterval(timerInterval);
          markAllAsRead();
          countdownElement.style.display = 'none';
          markBackAsUnreadButton.style.display = 'inline'; // הצגת הכפתור רק לאחר הטיימר
        }
      }, TIMER_INTERVAL_STEP);
    } else {
      countdownElement.style.display = 'none';
      markBackAsUnreadButton.style.display = 'none'; // לא להציג אם אין פריטים חדשים
    }
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
    countdownElement.style.display = 'none';
  };

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopTimer() : startTimer();
  });

  const markAllAsRead = () => {
    newsItems.forEach(item => item.classList.remove(NEW_ITEM_CLASS));
    localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, newsItems[0].id);
  };

  const restoreInitialUnreadItems = () => {
    newsItems.forEach(item => {
      const itemId = parseInt(item.id, 10);
      item.classList.toggle(NEW_ITEM_CLASS, initialUnreadItems.has(itemId));
    });
    localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, savedLastRead);
  };

  markAsReadButton.onclick = () => {
    stopTimer();
    markAllAsRead();
    markBackAsUnreadButton.style.display = 'none'; // לא להציג את הכפתור בלחיצה ידנית
    newItemsCount = 0;
  };

  markBackAsUnreadButton.onclick = () => {
    stopTimer();
    restoreInitialUnreadItems();
    markBackAsUnreadButton.style.display = 'none';
    // לא להתחיל את הטיימר מחדש
  };

  markAsUnreadButton.onclick = () => {
    stopTimer();
    newsItems.forEach(item => item.classList.add(NEW_ITEM_CLASS));
    localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, 0);
    newItemsCount = newsItems.length;
    markBackAsUnreadButton.style.display = 'none';
    // לא להתחיל את הטיימר מחדש
  };

  extraButtonsContainer.append(
    markAsReadButton,
    countdownElement,
    markBackAsUnreadButton,
    separator1,
    markAsUnreadButton
  );

  document.querySelector('.inner_sec_title').after(extraButtonsContainer);

  startTimer();
});
