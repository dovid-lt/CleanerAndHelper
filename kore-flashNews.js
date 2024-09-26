const LAST_NEWS_ID_STORAGE_KEY = 'lastNewsID';
const NEW_ITEM_CLASS = 'unread';

const markAllAsRead = () => {
  document.querySelectorAll(`.newsflash_list .item.${NEW_ITEM_CLASS}`).forEach(el => el.classList.remove(NEW_ITEM_CLASS));
  const latestNewsId = document.querySelector('.newsflash_list .item').id;
  localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, latestNewsId);
}

const markAllAsUnread = (savedLastRead) => {
 
}

const markNewItems = (lastReadId) => {
  let newItemsCount = 0;
  document.querySelectorAll('.newsflash_list .item').forEach(newsItem => {
      if (lastReadId && newsItem.id <= lastReadId) return;
      newsItem.classList.add(NEW_ITEM_CLASS);
      newItemsCount++;
  });

  return { newItemsCount };
};

document.addEventListener('DOMContentLoaded', () => {
  const savedLastRead = localStorage.getItem(LAST_NEWS_ID_STORAGE_KEY)
  const { newItemsCount } = markNewItems(savedLastRead || 0);

  let remainingTime = Math.min(newItemsCount, 5) * 3000 || 5000;
  let timerInterval;

  const startTimer = () => {
    timerInterval = setInterval(() => {
      remainingTime -= 1000;
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        markAllAsRead();
      }
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerInterval);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
    } else {
      startTimer();
    }
  });

  startTimer();

  const extraButtonsContainer = document.createElement('div');
  Object.assign(extraButtonsContainer.style, { display: 'flex', gap: '10px' });

  [
    { text: 'סמן הכל כנקרא', onClick: () => {
      clearInterval(timerInterval);
      markAllAsRead();
    }},
    { text: 'סמן הכל כלא נקרא', onClick: () => {
      clearInterval(timerInterval);
      markNewItems(savedLastRead)
      localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, savedLastRead);
    }}
  ].forEach(({ text, onClick }) => {
    const button = document.createElement('div');
    Object.assign(button, {
      textContent: text,
      style: { cursor: 'pointer' },
      onclick: onClick
    });
    extraButtonsContainer.appendChild(button);
  });
  document.querySelector('.inner_sec_title').after(extraButtonsContainer);
});
