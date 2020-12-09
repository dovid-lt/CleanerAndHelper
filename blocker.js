var selector = "div[id^='divB'], div[id^='advads'], .jdn-pirsum, script[type$='-text/javascript'], script[src='https://www.jdn.co.il/wp-content/plugins/jdn_ads/js/info.js']";
var query = document.querySelectorAll(selector);

query.forEach(function (element) {
  element.remove()
});




var divsPlayer = document.querySelectorAll(".flowplayer");

for (let player of divsPlayer) 
  if(player['data-item']){
      var props = JSON.parse(player['data-item']).source[0];
      var newV = document.createElement('video');
      newV.src = props.src;
      newV.type = props.type;
      player.replaceWith(newV);
  }


