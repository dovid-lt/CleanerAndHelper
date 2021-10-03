
const DEL_SELECTOR = `
#bottomFixed,
.center-block,
.visible-xlg`;

const mo = new MutationObserver(onMutation);
onMutation([{ addedNodes: [document.documentElement] }]);
observe();

function onMutation(mutations) {
  const toRemove = [];
  for (const { addedNodes } of mutations)
    for (const n of addedNodes) {
      if (!n.tagName) continue;
      if (n.matches(DEL_SELECTOR))
        toRemove.push(n);
      else if (n.firstElementChild && n.querySelector(DEL_SELECTOR)) {
        toRemove.push(...n.querySelectorAll(DEL_SELECTOR));
      }
    }

  if (toRemove.length) {
    mo.disconnect();
    for (const el of toRemove) el.remove();
    observe();
  }
}

function observe() { mo.observe(document, { subtree: true, childList: true, }); }
