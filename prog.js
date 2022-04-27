const DEL_SELECTOR = `

`;

const blackListJs = ['adBlockAction', 'samOverlay'];

function* actionForElement(el) {
  if(el.tagName == 'SCRIPT' && blackListJs.some(x => el.innerText.includes(x)))
    yield () => el.remove();
}


ObserveForDocument(actionForElement, document)
