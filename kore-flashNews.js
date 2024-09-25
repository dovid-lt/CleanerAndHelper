const key = 'lastNews';
const lastRead = localStorage.getItem(key);

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('newsFlash')?.remove();

  let container = document.querySelector('.newsflash_list');
  let it = container.children[Symbol.iterator]()
  let last = null;

  let result = it.next();
  if (!result.done)
    last = result.value.id;

  let currDate = Date.now();
  let counter = 0;

  if (lastRead) {
    container.classList.add('ext-c');
    do {
      if (result.value.id <= lastRead) break;
      counter++;
      result.value.classList.add('new-item');
      humanDate(result.value.children[0], currDate);

      result = it.next();
    } while (!result.done)
  }

  setTimeout(() => localStorage.setItem(key, last), counter ? Math.min(counter, 5) * 3000 : 5000);

});

function humanDate(el, currDate) {
  let reg = el?.innerText?.match(/(\d+)\.(\d+)\.(\d+)\ (\d\d):(\d\d)/);
  if (reg) {
    let extDate = new Date(reg[3], reg[2] - 1, reg[1], reg[4], reg[5]);
    let rel = timeDifference(currDate, extDate);
    el.innerText += `  (${rel})`;
  }
}


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
