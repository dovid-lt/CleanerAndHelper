var selector = "div[id^='divB'], div[id^='advads'], .jdn-pirsum, script[type$='-text/javascript'], script[src='https://www.jdn.co.il/wp-content/plugins/jdn_ads/js/info.js']";
var query = document.querySelectorAll(selector);


query.forEach(function (element) {
  element.remove()
});




var divsPlayer = document.querySelectorAll(".flowplayer");

for (let player of divsPlayer) 
  if(player.dataset.item){
      var props = JSON.parse(player.dataset.item).sources[0];
      var newV = document.createElement('video');
      newV.classList.add("flowplayer");
      newV.src = props.src;
      newV.type = props.type;
      newV.controls = true;
      player.replaceWith(newV);
  }


