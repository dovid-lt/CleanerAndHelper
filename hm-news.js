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
    var props;
    var item = player.dataset.item;
    if (item) {
      let parsed = JSON.parse(item);
      props = parsed.sources[0];
    } else {
      var a_items = player.parentNode.querySelectorAll("div.fp-playlist-external>a");
      props = [...a_items].map(x => JSON.parse(x?.dataset.item)).filter(x => !x.click && x.fv_title != "Video Ad:hamechadesh")[0]?.sources[0];
    }

    if (!props) continue;

    let newV = document.createElement('video');
    newV.classList.add("flowplayer");
    newV.src = props.src;
    newV.type = props.type;
    newV.controls = true;
    player.replaceWith(newV);
  }
});



