const LAST_NEWS_ID_STORAGE_KEY = 'lastNewsID';
const NEW_ITEM_CLASS = 'unread';

const markAllAsRead = (latestNewsId) => {
  document.querySelectorAll(`.${NEW_ITEM_CLASS}`).forEach(el => el.classList.remove(NEW_ITEM_CLASS));
  localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, latestNewsId);
}

const markNewItems = (containers, lastReadId) => {
  let newItemsCount = 0;
  let latestNewsId;

  containers.forEach(container => {
    for (const newsItem of container.children) {
      latestNewsId = newsItem.id;
      if (lastReadId && newsItem.id <= lastReadId) break;
      newsItem.classList.add(NEW_ITEM_CLASS);
      newItemsCount++;
    }
  });

  return { newItemsCount, latestNewsId };
};

document.addEventListener('DOMContentLoaded', () => {
  const { newItemsCount, latestNewsId } = markNewItems(
    document.querySelectorAll('.newsflash_list'),
    localStorage.getItem(LAST_NEWS_ID_STORAGE_KEY)
  );

  setTimeout(() => markAllAsRead(latestNewsId), Math.min(newItemsCount, 5) * 3000 || 5000);

  const markAllAsReadButton = document.createElement('div');
  markAllAsReadButton.textContent = 'סמן הכל כנקרא';
  markAllAsReadButton.style.cursor = 'pointer';
  markAllAsReadButton.addEventListener('click', () => markAllAsRead(latestNewsId));
  document.querySelector('.inner_sec_title').after(markAllAsReadButton);
});
