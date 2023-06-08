
const DEL_SELECTOR = `
script[src^="https://www.hidabroot.org/themes/HDB/assets/videojs.nuevo.gold_hidabroot.org/videojs"]
`;

const blackListJs = [];

function* actionForElement(el) {
  if (!el.tagName) return;
  if(el.tagName == 'VIDEO')
    el.classList.remove('video-js');
  if (el.matches(DEL_SELECTOR))
    yield () => el.remove();
  else if (el.firstElementChild)
    for (const iterator of el.querySelectorAll(DEL_SELECTOR))
      yield () => iterator.remove();
}


ObserveForDocument(actionForElement, document)





