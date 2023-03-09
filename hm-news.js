const DEL_SELECTOR = `
script[src="https://cdn.jsdelivr.net/npm/lap-core-js@1.3.2"],
iframe,
#sticky_banner_bottom_desktop_btn2,
#sticky_banner_left,
#sticky_banner_right,
#sticky_banner_bottom_desktop,
div.elementor-widget-html[id^=sticky_banner]

`;




function* actionForElement(el) {
  if (!el.tagName) return;
  if (el.matches(DEL_SELECTOR))
    yield () => el.remove();
  else if (el.firstElementChild)
    for (const iterator of el.querySelectorAll(DEL_SELECTOR))
      yield () => iterator.remove();

  if (el.matches('.elementor-widget-jet-video'))
    jetVideo(el);
  else if (el.matches('div.flowplayer'))
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

