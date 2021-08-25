const DEL_SELECTOR = `
div[id^='advads'],
div[id^='div-gpt-ad'],
.jdn-pirsum,
script#flowplayer-js-extra,
script#fv_player_pro-js,
script#flowplayer-hlsjs-js,
script#fv_player_pro-js-extra,
script#flowplayer-js,
style#fv_player_lightbox-css,
script#fv_vast-js,
script#advanced-ads-responsive-js,
script#advanced-ads-responsive-js-extra,
script#advanced-ads-sticky-footer-js-js,
script#advanced-ads-sticky-footer-js-js-extra,
script#advanced-ads-advanced-js-js,
script#advanced-ads-advanced-js-js-extra,
script#advanced_ads_pro\\/visitor_conditions-js,
script#advanced_ads_pro\\/visitor_conditions-js-extra,
script#advanced-ads-pro\\/cache_busting-js,
script#advanced-ads-pro\\/cache_busting-js-extra,
script#advanced-ds-pro\\/front-js,
script#advadsTrackingScript-js,
script#advadsTrackingDelayed-js,

script[src^='https://www.jdn.co.il/wp-content/uploads/452'],
script[src^='https://www.jdn.co.il/wp-content/plugins/jdn_ads/'],
iframe[loading="lazy"],
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
  var divsPlayer = document.querySelectorAll(".flowplayer");

  for (const player of divsPlayer) {

    let props;
    let item = player.dataset.item;
    if (item) {
      let parsed = JSON.parse(item);
      props = parsed.sources[0];
    } else {
      let a_items = player.parentNode.querySelectorAll("div.fp-playlist-external[rel='" + player.id  +  "']>a");
      console.log([...a_items]);
      props = [...a_items].map(x => JSON.parse(x?.dataset.item)).filter(x => !("click" in x) && x.fv_title != "Video Ad:youp")[0]?.sources[0];
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



