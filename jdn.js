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
script#advanced-ads-pro\\/front-js,
script#advadsTrackingScript-js,
script#advadsTrackingDelayed-js,
script#advads-ready,
script[src^='https://www.jdn.co.il/wp-content/uploads'],
script[src^='https://www.jdn.co.il/wp-content/plugins/jdn_ads'],

iframe[src^='https://advertising'],
iframe[loading="lazy"],
iframe[title="geula"],
iframe[title="medame"],
iframe[title="dosiz"]
`;



const blackListJs = ['fortcdn.com', 'advertising', 'Ads'];

function* elementsSelector(n) {
      if (!n.tagName) return;
      if (n.matches(DEL_SELECTOR) || (n.tagName == 'SCRIPT' && blackListJs.some(x => n.innerText.includes(x))))
        yield () => n.remove();
      else if (n.firstElementChild)
        for (const iterator of n.querySelectorAll(DEL_SELECTOR))
          yield () => iterator.remove();

      if (n.matches('.wp-video'))
        wpVideoHandel(n);
      else if (n.matches('.flowplayer'))
        flowplayerHandel(n);
}

ObserveForDocument(elementsSelector, document)


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



