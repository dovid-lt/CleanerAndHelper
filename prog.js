const DEL_SELECTOR = `
script[src^="/js/siropu/am/core.min.js"]
`;

const blackListJs = ['adBlockAction', 'samOverlay'];

function* actionForElement(el) {
  if (!el.tagName) return;
  if (el.matches(DEL_SELECTOR) || (el.tagName == 'SCRIPT' && blackListJs.some(x => el.innerText.includes(x))))
    yield () => el.remove();
}


ObserveForDocument(actionForElement, document)
