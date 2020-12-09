var selector = `
div[id^='divB'],
div[id^='advads'],
.jdn-pirsum,
script[type$='-text/javascript'],
script[src='https://www.jdn.co.il/wp-content/plugins/jdn_ads/js/info.js'],
iframe[title="geula"]
`;
var query = document.querySelectorAll(selector);


query.forEach(function (element) {
  element.remove()
});



var divsPlayer = document.querySelectorAll(".flowplayer");

for (let player of divsPlayer) 
  if(player.dataset.item){
      let parsed =  JSON.parse(player.dataset.item);
      if(!parsed.sources || !parsed.sources.length) continue;
      let props = parsed.sources[0];
      let newV = document.createElement('video');
      newV.classList.add("flowplayer");
      newV.src = props.src;
      newV.type = props.type;
      newV.controls = true;
      player.replaceWith(newV);
  }


