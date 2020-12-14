const DEL_SELECTOR = `
div[id^='advads'],
script#flowplayer-js-extra,
script#fv_player_pro-js,
script#flowplayer-hlsjs-js,
script#fv_player_pro-js-extra,
script#flowplayer-js,
style#fv_player_lightbox-css,
div.elementor-widget-wp-widget-advads_ad_widget

`;

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



window.addEventListener('DOMContentLoaded', (event) => {
  var divsPlayer = document.querySelectorAll(".flowplayer");

  for (const player of divsPlayer) {
    var item = null;
    if ((item = player.dataset.item || player.parentNode.querySelector("div.fp-playlist-external>a:last-child")?.dataset.item)) {
      let parsed = JSON.parse(item);
      if (!parsed.sources || !parsed.sources.length) continue;
      let props = parsed.sources[0];
      let newV = document.createElement('video');
      newV.classList.add("flowplayer");
      newV.src = props.src;
      newV.type = props.type;
      newV.controls = true;
      player.replaceWith(newV);
    }
  }
    
});



