const DEL_SELECTOR = `
div[id^='advads'],
script#flowplayer-js-extra,
script#fv_player_pro-js,
script#flowplayer-hlsjs-js,
script#fv_player_pro-js-extra,
script#flowplayer-js,
style#fv_player_lightbox-css,
div.elementor-widget-wp-widget-advads_ad_widget,

script#advanced-ads-advanced-js-js,
script#advanced-ads-responsive-js-extra,
script#advanced-ads-pro\\/cache_busting-js,
script#advanced-ads-pro\\/cache_busting-js-extra
`;

const blackListJs = ['advads_passive_placements', 'advanced_ads_ready', 'Ads', 'ads'];


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
      else if (n.tagName == 'SCRIPT' && !n.src && blackListJs.some(x => n.innerText.includes(x)))
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
  var divsPlayerFlow = document.querySelectorAll(".flowplayer");

  for (const player of divsPlayerFlow) {
    let props;
    let item = player.dataset.item;
    if (item) {
      let parsed = JSON.parse(item);
      props = parsed.sources[0];
    } else {
      let a_items = player.parentNode.querySelectorAll("div.fp-playlist-external>a");
      props = [...a_items].map(x => JSON.parse(x?.dataset.item)).filter(x => !("click" in x) && x.fv_title != "Video Ad:hamechadesh")[0]?.sources[0];
    }

    if (!props) continue;

    let newV = document.createElement('video');
    newV.classList.add("flowplayer");
    newV.src = props.src;
    newV.type = props.type;
    newV.controls = true;
    newV.style.maxHeight = '80vh'
    player.replaceWith(newV);
  }

  var divsPlayerJet = document.querySelectorAll(".elementor-widget-jet-video");

  for (const player of divsPlayerJet) {
    let dataEl = player.querySelector('.jet-video__overlay');
    if(!dataEl) continue;

    let newV = document.createElement('video');
    newV.src =  JSON.parse(dataEl.dataset.elementorLightbox)?.url;
    newV.controls = true;
    newV.style.maxHeight = '80vh';
    dataEl.parentNode.replaceWith(newV);
  }

});



