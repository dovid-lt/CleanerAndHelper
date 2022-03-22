const DEL_SELECTOR = `
script#advanced-ads-advanced-js-js,
script#advanced-ads-advanced-js-js-extra,
script#advadsTrackingDelayed-js,
script#advadsTrackingScript-js,
script#advadsTrackingScript-js-extra,
script#advanced-ads-layer-footer-js-js,
script#advanced-ads-layer-footer-js-js-extra,
script#advanced-ads-layer-fancybox-js-js,
script#advanced-ads-responsive-js,
script#advanced-ads-responsive-js-extra,
script#advanced-ads-pro\\/cache_busting-js,
script#advanced-ads-pro\\/cache_busting-js-extra,
script#advanced-ads-pro\\/front-js,
script#advanced_ads_pro\\/visitor_conditions-js,
script#advanced_ads_pro\\/visitor_conditions-js-extra,
script#advanced-ads-sticky-footer-js-js,
script#advanced-ads-sticky-footer-js-js-extra,
script#video_js_scriptie8-js,
script#video_js_script-js,
script#video-script-js,
.elementor-element-7c14956,


.bahazitleft-side,
.bahazitright-side,
.bahazitfixed-footer
`;

const PARENTS = '.elementor-widget-container, .bahazitright-side, .bahazitleft-side, .bahazitsticky, .bahazitdice-post';
const blackListJs = ['advads'];

function findParent(el, sel) {
    while (el = el.parentNode)
        if (el.matches(sel))
            return el;
    console.log('not found');
}

function* elementsSelector(mutations) {
    for (const { addedNodes } of mutations)
        for (const n of addedNodes) {
            if (!n.tagName) continue;
            if (n.matches(DEL_SELECTOR) || (n.tagName == 'SCRIPT' && blackListJs.some(x => n.innerText.includes(x))))
                yield () => n.remove();
            if (n.matches('.bahazithead, div[data-advadstrackid]'))
                yield () => findParent(n, PARENTS)?.remove();
            else if (n.firstElementChild)
                for (const iterator of n.querySelectorAll(DEL_SELECTOR))
                    yield () => iterator.remove();


            if (n.matches('.Elite_video_player'))
                yield () =>  ElitVideoHandel(n);
        }
}


function ElitVideoHandel(element){
    const opt = element.querySelector('div#elite_options')?.innerText;
    if (opt) {
        const src = /mp4HD":"([^"]+)"/.exec(opt) || /mp4SD":"([^"]+)"/.exec(opt);
        element.outerHTML = `<video controls src="${src[1].replace(/\\\//g, '/')}"></video>`;
    }
}


ObserveForDocument(elementsSelector, document)