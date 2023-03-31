
const DEL_SELECTOR = `
script[src^="/template/js/player.js?lu=2807"],
#bottomFixed,
.center-block,
.visible-xlg`;

const blackListJs = [];

function* actionForElement(el) {
  if (!el.tagName) return;
  if (el.matches(DEL_SELECTOR))
    yield () => el.remove();
  else if (el.firstElementChild)
    for (const iterator of el.querySelectorAll(DEL_SELECTOR))
      yield () => iterator.remove();
 
      
}


ObserveForDocument(actionForElement, document)


let dismisseExpire = localStorage.getItem('onesignal-notification-prompt');
if (dismisseExpire) {
  let data = JSON.parse(dismisseExpire);
  if (!data.CleanerExt && data.value == '"dismissed"') {
    data.timestamp = 1896127200000;
    data.CleanerExt = true;
    localStorage.setItem('onesignal-notification-prompt', JSON.stringify(data));
  }
}


