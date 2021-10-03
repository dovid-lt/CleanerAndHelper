const key = 'lastNews';
let curr = localStorage.getItem(key);

console.log(666);

document.addEventListener('DOMContentLoaded', function () {
  let flashes = document.getElementById('newsFlash');
  if (flashes)
    flashes.remove();

  let container = document.getElementById('listFlash');
  let it = container.children[Symbol.iterator]()
  let last = null;

  let result = it.next();
  if (!result.done)
    last = result.value.id;

  let currDate = Date.now();
  let counter = 0;

  if (curr)
    while (!result.done) {
      if (result.value.id <= curr) break;
      counter++;
      result.value.classList.add('new-item');
      let at = result.value.children[0];
      let reg = at.innerText.match(/(\d+)\.(\d+)\.(\d+)\ (\d\d):(\d\d)/);
      let extDate = new Date(reg[3],reg[2]-1, reg[1],reg[4],reg[5]);
      let rel = timeDifference(currDate,extDate);
      at.innerText += `  (${rel})`;
      result = it.next();
    }

  setTimeout(() => {
    localStorage.setItem(key, last);
  }, curr ? Math.max(counter, 5) * 3000 : 10000);



});

const rtf = new Intl.RelativeTimeFormat('he', { numeric: "auto" });
const msPerMinute = 60 * 1000;
const msPerHour = msPerMinute * 60;
const msPerDay = msPerHour * 24;
const msPerMonth = msPerDay * 30;
const msPerYear = msPerDay * 365;

function timeDifference(baseDate, theDate) {
    const current = baseDate;
    const elapsed = current - theDate;

    if (elapsed < msPerMinute) 
         return rtf.format(-Math.floor(elapsed/1000), 'seconds');   
    else if (elapsed < msPerHour) 
         return rtf.format(-Math.floor(elapsed/msPerMinute), 'minutes'); 
    else if (elapsed < msPerDay) 
         return rtf.format(-Math.floor(elapsed/msPerHour), 'hours');  
    else 
        return rtf.format(-Math.floor(elapsed/msPerHour), 'day'); 
}