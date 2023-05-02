var controls = localStorage.getItem("controls");
controls = JSON.parse(controls);
var buttons = document.getElementsByTagName('button');
for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    let move = controls[button.name]
    if (move != undefined) {
      if (move[1] === " ") {
        button.innerHTML = "Space";
      } else {
        button.innerHTML = move[1];
      }
    }
}

var inputs = document.getElementsByTagName('input');
for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    let move = controls[input.name]
    if (move != undefined) {
      input.value = move;
    }
}

function checkKey(e) {
  if (toggled) {
    if (e.key === " ") {
      document.getElementsByName(toggled)[0].innerHTML = "Space";
    } else {
      document.getElementsByName(toggled)[0].innerHTML = e.key;
    }
    controls[toggled] = [e.keyCode, e.key]
    toggled = null;
    update()
  }
}

const das = document.getElementById('DAS');
const arr = document.getElementById('ARR');
const grav_ARR = document.getElementById('grav_ARR');
das.addEventListener('change', (event) => {
  update()
});
arr.addEventListener('change', (event) => {
  update()
});
grav_ARR.addEventListener('change', (event) => {
  update()
});

function update() {
  controls["DAS"] = das.value;
  controls["ARR"] = arr.value;
  controls["grav_ARR"] = grav_ARR.value;
  console.log("autosaved");
  localStorage.setItem('controls', JSON.stringify(controls));
}

var toggled = null;
$(":button").click(function(event) {
  var button = event.target;
  if ($(button).attr('class') == "controls") {
    $(":button").blur();
    if (button.name == toggled) {
      document.getElementsByName(toggled)[0].innerHTML = controls[button.name][1]
      toggled = null;
    } else {
      if (toggled != null) {
        document.getElementsByName(toggled)[0].innerHTML = controls[button.name][1]
      }
      toggled = button.name
      document.getElementsByName(toggled)[0].innerHTML = "Press Any Key."
    }
  } else {
    if (button.name == "save") {
      controls["DAS"] = das.value;
      controls["ARR"] = arr.value;
      console.log(controls);
      localStorage.setItem('controls', JSON.stringify(controls));

    } else if (button.name == "resetControls") {
      controls = {
        "move_left": [37, "ArrowLeft"],
        "move_right": [39, "ArrowRight"],
        "rotate_left": [88, "s"],
        "rotate_right": [38, "ArrowUp"],
        "rotate_180": [65, "a"],
        "softdrop": [40, "ArrowDown"],
        "harddrop": [32, " "],
        "hold": [67, "c"],
        "restart": [115 , "F4"],
        "DAS": 200,
        "ARR": 10,
        "grav_ARR": 0,
      }

      localStorage.setItem('controls', JSON.stringify(controls));
      var buttons = document.getElementsByTagName('button');
      for (let i = 0; i < buttons.length; i++) {
          let button = buttons[i];
          let move = controls[button.name]
          if (move != undefined) {
            if (move[1] === " ") {
              button.innerHTML = "Space";
            } else {
              button.innerHTML = move[1];
            }
          }
      }
    }
  }
});



document.onkeydown = checkKey;