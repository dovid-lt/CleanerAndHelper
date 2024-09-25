const LAST_NEWS_ID_STORAGE_KEY = 'lastNewsID';
const NEW_ITEM_CLASS = 'new-item';

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

  setTimeout(() => {
    localStorage.setItem(LAST_NEWS_ID_STORAGE_KEY, latestNewsId);
    document.querySelectorAll(`.${NEW_ITEM_CLASS}`).forEach(el => el.classList.remove(NEW_ITEM_CLASS));
  }, Math.min(newItemsCount, 5) * 3000 || 5000);
});
