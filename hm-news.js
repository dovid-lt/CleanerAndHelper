const DEL_SELECTOR = `
iframe[data-src^="https://ads.hm-news.co.il"],
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
script#advanced-ads-pro\\/cache_busting-js-extra,


script#advadsTrackingDelayed-js,
script#advadsTrackingScript-js,
script#advadsTrackingScript-js-extra,
script#advanced-ads-responsive-js,
script#advanced-ads-pro\\/cache_busting-js-extra,
script#advanced-ads-layer-footer-js-js-extra,
script#advads-ready
`;

const blackListJs = ['advads_passive_placements', 'advanced_ads_ready', 'Ads'];


function* actionForElement(el) {
  if (!el.tagName) return;
  if (el.matches(DEL_SELECTOR) || (el.tagName == 'SCRIPT' && blackListJs.some(x => el.innerText.includes(x))))
    yield () => el.remove();
  else if (el.firstElementChild)
    for (const iterator of el.querySelectorAll(DEL_SELECTOR))
      yield () => iterator.remove();

  if (el.matches('.elementor-widget-jet-video'))
    jetVideo(el);
  else if (el.matches('.flowplayer'))
    flowplayer(el);
}

ObserveForDocument(actionForElement, document)



function flowplayer(player) {
  let props;
  let item = player.dataset.item;
  if (item) {
    let parsed = JSON.parse(item);
    props = parsed.sources[0];
  } else {
    let a_items = player.parentNode.querySelectorAll("div.fp-playlist-external>a");
    props = [...a_items].map(x => JSON.parse(x?.dataset.item)).filter(x => !("click" in x) && x.fv_title != "Video Ad:hamechadesh")[0]?.sources[0];
  }

  if (!props) return;

  let newV = document.createElement('video');
  newV.classList.add("flowplayer");
  newV.src = props.src;
  newV.type = props.type;
  newV.controls = true;
  newV.style.maxHeight = '80vh'
  player.replaceWith(newV);
}

function jetVideo(player) {
  let dataEl = player.querySelector('.jet-video__overlay');
  if (!dataEl) return;

  let newV = document.createElement('video');
  newV.src = JSON.parse(dataEl.dataset.elementorLightbox)?.url;
  newV.controls = true;
  newV.style.maxHeight = '80vh';
  dataEl.parentNode.replaceWith(newV);
}

