const DEL_SELECTOR = `
div[id^='advads'],
ul[id^='advads'],
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
script#advanced-ads-pro\\/front-js,
script#advadsTrackingScript-js,
script#advadsTrackingDelayed-js,
script#advads-ready,
script[src^='https://www.jdn.co.il/wp-content/uploads'],
script[src^='https://www.jdn.co.il/wp-content/plugins/jdn_ads'],
script[src='https://media.aso1.net/js/code.min.js'],
script[src='https://track.jdn.co.il/js/code.min.js'],

iframe[src^='https://advertising'],
iframe[loading="lazy"],
iframe[title="geula"],
iframe[title="medame"],
iframe[title="dosiz"]
`;



const blackListJs = ['fortcdn.com', 'advertising', 'Ads'];

function* actionForElement(el) {
      if (!el.tagName) return;
      if (el.matches(DEL_SELECTOR) || (el.tagName == 'SCRIPT' && blackListJs.some(x => el.innerText.includes(x))))
        yield () => el.remove();
      else if (el.firstElementChild)
        for (const iterator of el.querySelectorAll(DEL_SELECTOR))
          yield () => iterator.remove();

      if (el.matches('.wp-video'))
        wpVideoHandel(el);
      else if (el.matches('.flowplayer'))
        flowplayerHandel(el);
}

ObserveForDocument(actionForElement, document)


function wpVideoHandel(div) {
  const src = div.querySelector('source')?.src;
  if (src)
    div.outerHTML = `<video controls style="max-height: 80hv" src="${src}"></video>`;
}

function flowplayerHandel(player) {
  let props;
  let item = player.dataset.item;
  if (item) {
    let parsed = JSON.parse(item);
    props = parsed.sources[0];
  } else {
    let a_items = player.parentNode.querySelectorAll("div.fp-playlist-external[rel='" + player.id + "']>a");
    console.log([...a_items]);
    props = [...a_items].map(x => JSON.parse(x?.dataset.item)).filter(x => !("click" in x) && x.fv_title != "Video Ad:youp")[0]?.sources[0];
  }

  if (!props) return;

  let newV = document.createElement('video');
  newV.classList.add("flowplayer");
  newV.src = props.src;
  newV.type = props.type;
  newV.controls = true;
  newV.style.maxHeight = '80vh';
  player.replaceWith(newV);
}



