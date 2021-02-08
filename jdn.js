const DEL_SELECTOR = `
div[id^='advads'],
div[id^='div-gpt-ad'],
.jdn-pirsum,
script[src^='https://www.jdn.co.il/wp-content/uploads/452'],
script[src^='https://www.jdn.co.il/wp-content/plugins/jdn_ads/'],
iframe[title="geula"],
iframe[title="medame"],
iframe[title="dosiz"]
`;

const blackListJs = ['fortcdn.com', 'ads', 'Ads'];

const mo = new MutationObserver(onMutation);
onMutation([{ addedNodes: [document.documentElement] }]);
observe();




function onMutation(mutations) {
  const toRemove = [];
  for (const { addedNodes } of mutations)
    for (const n of addedNodes) {
      if (!n.tagName) continue;
      if(n.tagName == 'SCRIPT' && !n.src && blackListJs.some(x => n.innerText.includes(x)))
         toRemove.push(n);
      else if (n.matches(DEL_SELECTOR))
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



window.addEventListener('DOMContentLoaded', (event) => {
  var divsPlayer = document.querySelectorAll(".flowplayer");

  for (const player of divsPlayer)
    if (player.dataset.item) {
      let parsed = JSON.parse(player.dataset.item);
      if (!parsed.sources || !parsed.sources.length) continue;
      let props = parsed.sources[0];
      let newV = document.createElement('video');
      newV.classList.add("flowplayer");
      newV.src = props.src;
      newV.type = props.type;
      newV.controls = true;
      player.replaceWith(newV);
    }
    
});



