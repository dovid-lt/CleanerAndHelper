const key = 'lastNewsID';
const lastRead = localStorage.getItem(key);

const rtf = new Intl.RelativeTimeFormat('he', { numeric: "auto" });
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

function timeDifference(baseDate, theDate) {
  const elapsed = baseDate - theDate;

  if (elapsed < msPerMinute)
    return rtf.format(-Math.floor(elapsed / 1000), 'seconds');
  else if (elapsed < msPerHour)
    return rtf.format(-Math.floor(elapsed / msPerMinute), 'minutes');
  else if (elapsed < msPerDay)
    return rtf.format(-Math.floor(elapsed / msPerHour), 'hours');
  else
    return rtf.format(-Math.floor(elapsed / msPerDay), 'day');
}

function humanDate(element, now) {
  const date = new Date(element.getAttribute('datetime'));
  element.textContent = timeDifference(now, date);
}

document.addEventListener('DOMContentLoaded', function () {  
  let containers = document.querySelectorAll('.newsflash_list');
  let counter = 0;
  let last;
  
  containers.forEach(container => {
    const items = container.children;
    for (const item of items) {
      last = item.id;
      if (lastRead) {
        if (item.id <= lastRead) break;
        counter++;
        item.classList.add('new-item');
        let now = Date.now();
        humanDate(item.children[0], now);
      }
    }
  });

  setTimeout(() => {
    localStorage.setItem(key, last);
    document.querySelectorAll('.new-item').forEach(el => el.classList.remove('new-item'));
  }, counter ? Math.min(counter, 5) * 3000 : 5000);
});
