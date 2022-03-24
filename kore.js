
const DEL_SELECTOR = `
#bottomFixed,
.center-block,
.visible-xlg`;

const blackListJs = [];

function* elementsSelector(mutations) {
  for (const { addedNodes } of mutations)
    for (const n of addedNodes) {
      if (!n.tagName) continue;
      if (n.matches(DEL_SELECTOR))
        yield () => n.remove();
      else if (n.firstElementChild)
        for (const iterator of n.querySelectorAll(DEL_SELECTOR))
          yield () => iterator.remove();
    }
}

ObserveForDocument(elementsSelector, document)


let dismisseExpire = localStorage.getItem('onesignal-notification-prompt');
if (dismisseExpire) {
  let data = JSON.parse(dismisseExpire);
  if (!data.CleanerExt && data.value == '"dismissed"') {
    data.timestamp = 1896127200000;
    data.CleanerExt = true;
    localStorage.setItem('onesignal-notification-prompt', JSON.stringify(data));
  }
}
