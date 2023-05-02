const colors = ["#000000" ,"#FF0100", "#FEAA00", "#FFFE02", "#00EA01", "#00DDFF", "#0000FF", "#AA00FE", "#555555"]
var filters = {
  "easy": true,
  "medium": true,
  "hard": true,
  "show_cleared": false,
  "show_legacy": false,
}

$(":button").click(function(event) {
  var button = event.target;
  if ($(button).attr('class') == "filter") {
    filters[button.name] = !filters[button.name]
    if (filters[button.name]) {
      button.setAttribute("style", "background: #AEAEAE;");
    } else {
      button.setAttribute("style", "background: #7E7E7E;");
    }
  }
})
const width = 190;
const height = 380;
var userData = localStorage.getItem('userData');
if (typeof userData == "string") {
  var userData = JSON.parse(userData);
}
function round(num) {
    return Math.ceil(num * 100) / 100;
}
$.getJSON("setups.json", function( data ) {
  var i = true
  var difficulties = ["easy", "medium", "hard"]
  var scoring = {
    "easy": 1,
    "medium": 3,
    "hard": 5
  }
  var board_index = {}
  for (var difficulty in difficulties) {
    diff = difficulties[difficulty]
    sorted_keys = [];
    for (var key in data[diff]) {
      if (data[diff].hasOwnProperty(key)) {
        sorted_keys.push([key, data[diff][key]["completions"]/data[diff][key]["plays"]])
      }
    }
    sorted_keys.sort(function(b, a) {
      if (Number.isNaN(a[1])) {
        a[1] = 0;
      }
      if (Number.isNaN(b[1])) {
        b[1] = 0;
      }
      return a[1] - b[1];
    });
    for (const pair of sorted_keys) {
      key = pair[0]
      var winrate = data[diff][key]["completions"]/data[diff][key]["plays"]
      var completed = false;
      var completed_text = "";
      if (userData != undefined) {
        keys = Object.keys(userData["history"])
        for (var k = 0; k < keys.length; k++) {
          if (keys[k] == key && userData["history"][keys[k]]["completed"]) {
            completed = true;
            completed_text = `
            <h2 class="preview completed">Completed</h2>`
          }
        }
      }
      if (Number.isNaN(winrate)) {
        winrate = 0
      }
      board_index[i] = [diff, key];
      var level = `<a href="game?difficulty=${diff}&setup=${key}">
        <div class="level" data-difficulty="${diff}" data-completed="${completed}" data-season="${data[diff][key]["season"]}">
          <canvas id="${i}" width="190" height="380" class="preview board"></canvas>
          <h1 class="preview title">${key}</h1>
          <h2 class="preview season">Season ${data[diff][key]["season"]}</h2>
          <h2 class="preview description">${data[diff][key]["description"]}</h2>
          <h3 class="preview difficulty ${diff}">${diff} - worth ${scoring[diff]} points</h3>
          <h4 class="preview winrate">${round(winrate * 100)}% cleared of ${data[diff][key]["plays"]}</h4>
          <h4 class="preview bonus">(+${((1-round(winrate))*scoring[diff]).toFixed(1)} bonus)</h4>
          ${completed_text}
        </div>
      </a>`
      document.getElementsByClassName("levels")[0].innerHTML += level;
      i++
    }
  }
  var canvi = document.getElementsByTagName("canvas")
  for (var c = 0; c < canvi.length; c++) {
    i = canvi[c].id
    const canvas = canvi[c]
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    var board = data[board_index[i][0]][board_index[i][1]]["board"];
    for (var pixelY = 0; pixelY < board.length; pixelY++) {
     for (var pixelX = 0; pixelX < board.length; pixelX++) {
       if (board[pixelY][pixelX] != 0) {
         // ctx.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
         ctx.fillStyle = colors[board[pixelY][pixelX]];
         ctx.fillRect(pixelX * width/10, pixelY * width/10, width/10, width/10)
       }
     }
    }
  }

  setInterval(function(){
    var els = document.getElementsByClassName("level");
    Array.prototype.forEach.call(els, function(item, i) {
      searched = document.getElementById('search').value.toLowerCase()
      scanner = 0
      tags = []
      while (searched.indexOf("\"", scanner) != -1) {
        if (searched.indexOf("\"", scanner + 1) != -1) {
          tags.push(searched.slice(searched.indexOf("\"", scanner) + 1, searched.indexOf("\"", scanner + 1)))
          searched = searched.slice(0, searched.indexOf("\"", scanner - 1)) + searched.slice(searched.indexOf("\"", scanner + 1) + 1,searched.length)
          scanner = 0;
        };
        scanner++;
      };
      scanner = 0
      while (searched.indexOf("[", scanner) != -1) {
        if (searched.indexOf("]", scanner + 1) != -1) {
          tags.push(searched.slice(searched.indexOf("[", scanner) + 1, searched.indexOf("]", scanner + 1)))
          searched = searched.slice(0, searched.indexOf("[", scanner - 1)) + searched.slice(searched.indexOf("]", scanner + 1) + 1,searched.length)
          scanner = 0;
        };
        scanner++;
      };
      function check(text){
        var arrayLength = tags.length;
        if (arrayLength == 0) {
          return true
        }
        for (var i = 0; i < arrayLength; i++) {
            if (text.includes(tags[i])){
              return true
            }
        }
        return false
      }
      searched = searched.trimStart()
      searched = searched.trimEnd()
      if ( (filters["show_legacy"] || item.dataset.season == data.global.season) && ((filters["show_cleared"] && item.dataset.completed == "true") || (item.dataset.completed == "false")) && filters[item.dataset.difficulty] && (item.getElementsByClassName("description")[0].innerHTML.toLowerCase().includes(searched) || (item.getElementsByClassName("title")[0].innerHTML.toLowerCase().includes(searched))) && (check(item.getElementsByClassName("title")[0].innerHTML.toLowerCase()) || check(item.getElementsByClassName("description")[0].innerHTML.toLowerCase()))){
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    })
  }, 100);

});