const pieces = ['Z', 'L', 'O', 'S', 'I', 'J', 'T'];
const colors = ['#000000', '#FF0100', '#FEAA00', '#FFFE02', '#00EA01', '#00DDFF', '#0000FF', '#AA00FE', '#555555'];
const piecesReversed = { Z: 'S', S: 'Z', L: 'J', J: 'L', I: 'I', T: 'T', O: 'O' };
const pieceValuesReversed = { 1: 4, 4: 1, 2: 6, 6: 2 };
const piece_matrix = {
	Z: [
		[1, 1, 0],
		[0, 1, 1],
		[0, 0, 0],
	],
	L: [
		[0, 0, 2],
		[2, 2, 2],
		[0, 0, 0],
	],
	O: [
		[3, 3],
		[3, 3],
	],
	S: [
		[0, 4, 4],
		[4, 4, 0],
		[0, 0, 0],
	],
	I: [
		[0, 0, 0, 0],
		[5, 5, 5, 5],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
	],
	J: [
		[6, 0, 0],
		[6, 6, 6],
		[0, 0, 0],
	],
	T: [
		[9, 7, 9],
		[7, 7, 7],
		[0, 0, 0],
	],
	null: [[0]],
};

const wallkicks = {
	"0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], //special
	"1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
	"1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
	"2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
	"2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], //special
	"3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
	"3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
	"0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
	"0-2": [[0, 0]],
	"1-3": [[0, 0]],
	"2-0": [[0, 0]],
	"3-1": [[0, 0]],
  };
  
  const i_wallkicks = {
	"0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
	"1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
	"1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
	"2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
	"2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
	"3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
	"3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
	"0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
	"0-2": [[0, 0]],
	"1-3": [[0, 0]],
	"2-0": [[0, 0]],
	"3-1": [[0, 0]],
  };

const empty_line = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

defaultControls = {
	move_left: [37, 'ArrowLeft'],
	move_right: [39, 'ArrowRight'],
	rotate_left: [88, 's'],
	rotate_right: [38, 'ArrowUp'],
	rotate_180: [65, 'a'],
	softdrop: [40, 'ArrowDown'],
	harddrop: [32, ' '],
	hold: [67, 'c'],
	restart: [115, 'F4'],
	skip: [116, 'F5'],
	reset: [117, 'F6'],
	DAS: 200,
	ARR: 10,
	grav_ARR: 0
};

var controls = localStorage.getItem('controls');
controls = { ...defaultControls, ...JSON.parse(controls) };
console.log(controls);
document.getElementById('reset').textContent = controls.restart[1];
document.getElementById('skip').textContent = controls.skip[1];
document.getElementById('restart').textContent = controls.reset[1];

var all_tasks = {
	lines_cleared: 0,
	lines_sent: 0,
	single: 0,
	double: 0,
	triple: 0,
	tetris: 0,
	tspin: 0,
	tspin_single: 0,
	tspin_double: 0,
	tspin_triple: 0,
	mini_tspin: 0,
	mini_tspin_single: 0,
	mini_tspin_double: 0,
	b2b: 0,
	pc: 0,
	combo: 0,
};

var task_names = {
	lines_cleared: 'Lines Cleared',
	lines_sent: 'Lines Sent',
	single: 'Singles',
	double: 'Doubles',
	triple: 'Triples',
	tetris: 'Quads',
	tspin: 'T-Spins',
	tspin_single: 'T-Spin Singles',
	tspin_double: 'T-Spin Doubles',
	tspin_triple: 'T-Spin Triples',
	mini_tspin: 'T-Spin Mini',
	mini_tspin_single: 'Mini T-Spin Single',
	mini_tspin_double: 'Mini T-Spin Double',
	b2b: 'Back to Backs',
	pc: 'Perfect Clears',
	combo: 'Combos',
};

var piece_displacement = {
	I: [-0.5, -0.5],
	O: [0.5, 0],
};

var setupData;
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const height = 600;
const width = 500;
userid = JSON.parse(localStorage.getItem('userData'))['userid'];

function updateLeaderboard(topUsers) {
	$.getJSON('setups.json', function (data) {
		var color_values = ['white', 'white', '#ff8ff6', '#f1c40f', '#f1c40f'];
		html_str = '';
		console.log(topUsers);
		for (var i = 0; i < topUsers.length; i++) {
			//if (userid == topUsers[i]["userid"] && topUsers[i]["rush_access"] == 1 && topUsers[i]["supporter"] < 2) {
			//    document.getElementById("error_sup").style.display = "block";
			//}
			if (!data['global']['banned'].includes(topUsers[i]['userid']) && topUsers[i]['rush_score'] != 0) {
				if (topUsers[i]['supporter'] >= 2) {
					color = color_values[topUsers[i]['supporter']];
				} else {
					color = 'white';
				}
				if (topUsers[i]['username'].replace(/\s+/g, '') == '') {
					topUsers[i]['username'] = '???';
				}
				var htmlData = `<a href="profile?userid=${topUsers[i]['userid']}"><li class="miniLeaderboardItem">
          <img class="leaderboard icon" src="https://cdn.discordapp.com/avatars/${topUsers[i]['userid']}/${topUsers[i]['avatar']}.webp" height="25" width="25" onerror="this.onerror=null; this.src='https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png'">
          <span class="miniLeaderboardName" style="color:${color}">${topUsers[i]['username']}</span>
          <span class="miniLeaderboardPoints">${topUsers[i]['rush_score']} Puzzles</span>
        </li></a>`;
				html_str += htmlData;
			}
		}
		document.getElementById('miniLeaderboard').innerHTML += html_str;
	});
}

// url = 'https://twowi.de/rushLeaderboard';
url = './rushLeaderboard.json'
fetch(url)
	.then((response) => response.json())
	.then((json) => updateLeaderboard(json));

window.addEventListener('load', function () {
	var loadedNext;
	var interval;
	var globData;
	var intervalToggle;
	var countdown;
	var lives = 3;

	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	completedTracker = document.getElementsByClassName('completedTracker')[0];
	// if (localStorage.getItem("discord_info") == null) {
	//     document.getElementById("error_login").style.display = "block";
	//     document.getElementById("startBtn").style.display = "none";
	// }
	var fragment = localStorage.getItem('discord_info');
	fragment = new URLSearchParams(fragment);
	accessToken = fragment.get('access_token');
	tokenType = fragment.get('token_type');
	// url = 'https://twowi.de/getRush';
	// url = './getRush1.json';
	url = `https://swng.github.io/twowide_data/getRush.json`;
	var headers = new Headers();
	headers.set('Authorization', accessToken + ':' + tokenType);
	fetch(url, {
		method: 'GET',
		headers: headers,
	})
		.then((response) => response.json())
		.then((json) => init(json));

	function init(json) {
		if ('error' in json) {
			document.getElementById('error_perm').style.display = 'block';
			document.getElementById('startBtn').style.display = 'none';
			return;
		}
		$.getJSON('setups.json', function (mainData) {
			globData = mainData;
			document.getElementById('startBtn').style.display = 'inline-block';
			document.getElementById('startBtn').onclick = function () {
				var all = document.getElementsByClassName('beforeStart');
				for (var i = 0; i < all.length; i++) {
					all[i].style.display = 'none';
				}
				var all = document.getElementsByClassName('afterStart');
				for (var i = 0; i < all.length; i++) {
					all[i].style.display = 'initial';
				}
				console.log('started');
				// url = 'https://twowi.de/getRush';
				// url = './getRush1.json';
				url = `https://swng.github.io/twowide_data/getRush.json`;
				fetch(url, {
					method: 'GET',
					headers: headers,
				})
					.then((response) => response.json())
					.then((json) => start(json, mainData))
					// .then(json => start(json, mainData))
					.catch((error) => console.log(error));
			};
		});
	}
	$('body').on('keydown', function (key) {
		for (var testKey in controls) {
			if (testKey == 'reset') {
				if (key.which == controls['reset'][0] && countdown < 2950 && lives != 0) {
					loadedNext = true;
					countdown = 0;
					document.getElementById('checklist').innerHTML = '';
					document.getElementsByClassName('completedTracker')[0].innerHTML = '';
					intervalToggle = false;
					clearInterval(interval);
					clearInterval(timer);
					// url = 'https://twowi.de/getRush';
					// url = './getRush1.json';
					url = `https://swng.github.io/twowide_data/getRush.json`;
					fetch(url, {
						method: 'GET',
						headers: headers,
					})
						.then((response) => response.json())
						.then((json) => start(json, globData))
						.catch((error) => console.log(error));
					var http = new XMLHttpRequest();
					http.timeout = 2000;
					http.open('POST', 'completedRush', true);
					http.setRequestHeader('Content-Type', 'application/json');
					sendData = {
						score: parseInt(document.getElementById('completedCounter').innerHTML),
						access_token: accessToken,
						token_type: tokenType,
					};
					http.send(JSON.stringify(sendData));
				}
			}
		}
	});

	function start(data, mainData) {
		document.getElementById('completedCounter').innerHTML = '0';
		if ('error' in data) {
			alert(data['error']);
		} else {
			data.sort((a,b) => parseFloat(b.winrate) - parseFloat(a.winrate));
			console.log(data);
			lives = 3;
			countdown = 30000;
			timer = setInterval(function () {
				if (countdown <= 0 || lives === 0) {
					lives = 0;
				} else {
					if (document.hidden) {
						countdown -= 10;
					} else {
						countdown--;
					}
					minutes = Math.floor(countdown / 600);
					seconds = countdown / 10 - minutes * 60;
					seconds = seconds.toFixed(1);
					if (seconds < 10) {
						seconds = '0' + seconds;
					}
					document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
				}
			}, 100);
			console.log('chokepoint2');
			var board_id = 0;
			const combo_table = [0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5];
			const norm_das = mainData['global']['norm_das'];
			const norm_arr = mainData['global']['norm_arr'];
			console.log('chokepoint3');
			const grav = mainData['global']['grav'];
			if ('grav_ARR' in controls) {
				var fall_speed = controls['grav_ARR'];
			} else {
				var fall_speed = mainData['global']['fall_speed'];
			}
			console.log('chokepoint1');
			controls = localStorage.getItem('controls');
			controls = JSON.parse(controls);
			var das = controls['DAS'];
			var arr = controls['ARR'];
			setupData = data[board_id];
			const cont = setupData['continue_queue'];
			var start = new Date().getTime();
			var keyDict = {};
			var ingame = true;
			var winning;
			var userData = localStorage.getItem('userData');
			$('body').on('keydown', function (key) {
				test = [];
				for (var testKey in controls) {
					if (controls.hasOwnProperty(testKey)) {
						test.push(controls[testKey][1]);
						if (key.which == controls[testKey][0]) {
							key.preventDefault();
						}
					}
				}
				if (keyDict[key.which] === undefined) {
					keyDict[key.which] = [0, 0, 0, true];
				}
				if (keyDict[key.which][1] >= keyDict[key.which][0]) {
					keyDict[key.which] = [new Date().getTime(), keyDict[key.which][1], keyDict[key.which][2], true];
				}

				// if (key.key == "`") {
				// 	console.log("cheater");
				// 	let id = data[board_id]['id'];
				// 	url = 'https://swng.github.io/twowide_data/solutions.txt'
				// 	fetch(url, {
				// 		method: 'GET'
				// 	})
				// 		.then((response) => response.text())
				// 		.then((text) => {
				// 			let solution_link = text.split('\n')[id];
				// 			console.log(solution_link);
				// 			window.open(solution_link, '_blank');
				// 		});
				// }
			});
			$('body').on('keyup', function (key) {
				// if (keyDict[key.which] === undefined) {
				//   keyDict[key.which] = [1, 0, 0, true]
				// }
				delete keyDict[key.which]; // = [keyDict[key.which][0], new Date().getTime(), keyDict[key.which][2], true]
			});
			var next_drop = grav;

			intervalToggle = true;
			interval = setInterval(loop, 15);
			$(document).ready(function () {
				$(window)
					.focus(function () {
						clearInterval(interval);
						if (intervalToggle) {
							interval = setInterval(loop, 15);
						}
						keyDict = {};
						// var keys = Object.keys(keyDict);
						// for(var i = 0; i < keys.length;i++){
						//   if (keyDict[i] === undefined) {
						//     keyDict[i] = [1, 0, 0, true]
						//   }
						//   keyDict[keys[i]] = [keyDict[i][0], new Date().getTime(), keyDict[i][2], true]
						// }
					})
					.blur(function () {
						clearInterval(interval);
					});
			});

			function loop() {
				if (lives == 0) {
					console.log('Game Over');

					var http = new XMLHttpRequest();
					http.timeout = 2000;
					http.open('POST', 'saveRush', true);
					http.setRequestHeader('Content-Type', 'application/json');
					sendData = {
						id: data[board_id]['id'],
						win: false,
						access_token: accessToken,
						token_type: tokenType,
					};
					http.send(JSON.stringify(sendData));

					document.getElementById('gameOverDiv').style.display = 'block';
					intervalToggle = false;
					clearInterval(interval);
					clearInterval(timer);
					document.getElementById('endingBoard').src = canvas.toDataURL();
					$('#shareButtons').attr(
						'data-a2a-title',
						`I was able to complete ${parseInt(
							document.getElementById('completedCounter').innerHTML
						)} puzzles in twowi.de's new Rush mode!`
					);
					document.getElementById('playAgain').onclick = function () {
						var all = document.getElementsByClassName('beforeStart');
						for (var i = 0; i < all.length; i++) {
							all[i].style.display = 'initial';
						}
						var all = document.getElementsByClassName('afterStart');
						for (var i = 0; i < all.length; i++) {
							all[i].style.display = 'none';
						}
						completedTracker.innerHTML = '';
						document.getElementById('gameOverDiv').style.display = 'none';
						document.getElementById('miniLeaderboard').innerHTML = '';
						document.getElementById('checklist').innerHTML = '';
						// url = 'https://twowi.de/rushLeaderboard';
						url = "./rushLeaderboard.json";
						fetch(url)
							.then((response) => response.json())
							.then((json) => updateLeaderboard(json));
					};
					var http = new XMLHttpRequest();
					http.timeout = 2000;
					http.open('POST', 'completedRush', true);
					http.setRequestHeader('Content-Type', 'application/json');
					sendData = {
						score: parseInt(document.getElementById('completedCounter').innerHTML),
						access_token: accessToken,
						token_type: tokenType,
					};
					http.send(JSON.stringify(sendData));
				}
				var keys = Object.keys(keyDict);
				leftRight = 0;
				var prio;
				for (var i = 0; i < keys.length; i++) {
					if (keys[i] == controls['move_left'][0] || keys[i] == controls['move_right'][0]) {
						leftRight++;
						prio = keys[i];
					}
					if (leftRight == 2) {
						if (keyDict[keys[1]][0] > keyDict[keys[0]][0]) {
							prio = keys[1];
						} else {
							prio = keys[0];
						}
					}
				}
				for (var i = 0; i < keys.length; i++) {
					//console.log(controls["reset"])
					if (keys[i] == controls['move_left'][0] || keys[i] == controls['move_right'][0]) {
						if (keys[i] == prio) {
							if (
								keyDict[keys[i]][0] > keyDict[keys[i]][1] &&
								(new Date().getTime() - keyDict[keys[i]][0] >= das || keyDict[keys[i]][3] == true) &&
								new Date().getTime() - keyDict[keys[i]][2] >= arr
							) {
								if (arr == 0 && keyDict[keys[i]][3] == false) {
									for (var mov = 0; mov < 9; mov++) {
										move(keys[i]);
									}
								} else {
									move(keys[i]);
								}
								keyDict[keys[i]] = [
									keyDict[keys[i]][0],
									keyDict[keys[i]][1],
									new Date().getTime(),
									false,
								];
							}
						}
						//} else if (keys[i] != controls["softdrop"][0] && keys[i] != controls["reset"][0]) { // && keys[i] != controls["harddrop"][0]
					} else if (keys[i] != controls['softdrop'][0]) {
						// && keys[i] != controls["harddrop"][0]
						if (
							keyDict[keys[i]][0] > keyDict[keys[i]][1] &&
							(new Date().getTime() - keyDict[keys[i]][0] >= norm_das || keyDict[keys[i]][3] == true) &&
							new Date().getTime() - keyDict[keys[i]][2] >= norm_arr
						) {
							move(keys[i]);
							keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false];
						}
					} else if (keys[i] == controls['softdrop'][0]) {
						if (
							keyDict[keys[i]][0] > keyDict[keys[i]][1] &&
							new Date().getTime() - keyDict[keys[i]][2] >= fall_speed
						) {
							move(keys[i]);
							keyDict[keys[i]] = [keyDict[keys[i]][0], keyDict[keys[i]][1], new Date().getTime(), false];
							next_drop = grav;
						}
					}
				}
				next_drop--;
				if (next_drop == 0) {
					next_drop = grav;
					gravity();
					graficks();
				}
			}

			function gravity() {
				if (collide([pieceMatrix, x, y + 1, piece])) {
					place([pieceMatrix, x, y, piece]);
				} else {
					y++;
				}
				lastMoveRotate = false;
			}

			function rotate(matrix) {
				const n = matrix.length;
				const x = Math.floor(n / 2);
				const y = n - 1;
				for (let i = 0; i < x; i++) {
					for (let j = i; j < y - i; j++) {
						k = matrix[i][j];
						matrix[i][j] = matrix[y - j][i];
						matrix[y - j][i] = matrix[y - i][y - j];
						matrix[y - i][y - j] = matrix[j][y - i];
						matrix[j][y - i] = k;
					}
				}
			}
			var tasks = JSON.parse(JSON.stringify(all_tasks));
			var goals = JSON.parse(JSON.stringify(setupData['goals']));
			for (var task in goals) {
				if (goals.hasOwnProperty(task)) {
					try {
						if (task != 'lines_sent') {
							document.getElementById('checklist').innerHTML += `
          			<h2 class="rush task" id="${task}">${all_tasks[task]}/${goals[task]} ${task_names[task]}</h2>`;
						} else {
							document.getElementById('checklist').innerHTML += `
              <div id="max_lines">
                <div id="lines_sent"></div>
              </div>
              <h2> Lines Sent </h2>`;
						}
					} catch (e) {
						console.log(e);
					}
				}
			}
			if (setupData.hasOwnProperty('disable_hold')) {
				var disable_hold = true;
				document.getElementById('checklist').innerHTML += `
          <h2 class="task">Hold Disabled</h2>`;
			} else {
				var disable_hold = false;
			}
			var restrictions = JSON.parse(JSON.stringify(setupData['restrictions']));
			var board = JSON.parse(JSON.stringify(setupData['board']));
			var piecesPlaced = 0;
			var combo = 0;
			var queue = setupData['pieces'].map((x) => x);
			if (queue.length < 10 && cont) {
				addBag();
			}
			var held = setupData['held'];
			if (Math.random() < 0.5) {
				for (let g = 0; g < board.length; g++) {
					for (let h = 0; h < board[g].length; h++) {
						if (Object.keys(pieceValuesReversed).includes(board[g][h].toString())) {
							board[g][h] = pieceValuesReversed[board[g][h].toString()];
						}
					}
					board[g] = board[g].reverse();
				}
				if (held) {
					held = piecesReversed[held];
				}
				for (let h = 0; h < queue.length; h++) {
					queue[h] = piecesReversed[queue[h]];
				}
				setupData['board'] = JSON.parse(JSON.stringify(board));
				setupData['pieces'] = queue.map((x) => x);
				setupData['held'] = held;
			}
			var piece = queue.shift();
			if (piece == 'O') {
				x = 4;
			} else {
				x = 3;
			}
			var y = 0;
			var rotation = 0;
			var lastMoveRotate = false;
			var b2b = false;
			pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
			graficks();

			function collide(pieceData) {
				for (var testY = 0; testY < pieceData[0].length; testY++) {
					for (var testX = 0; testX < pieceData[0][0].length; testX++) {
						if (pieceData[0][testY][testX] != 0 && pieceData[0][testY][testX] != 9) {
							if (
								pieceData[2] + testY >= board.length ||
								pieceData[1] + testX >= board[0].length ||
								pieceData[2] + testY < 0 ||
								pieceData[1] + testX < 0
							) {
								return true;
							}
							if (board[pieceData[2] + testY][pieceData[1] + testX] != 0) {
								return true;
							}
						}
					}
				}
				return false;
			}

			function tryWallkick(prev, current) {
				if (piece == 'I') {
					kicktable = i_wallkicks;
				} else {
					kicktable = wallkicks;
				}
				current_table = kicktable[prev.toString() + '-' + current.toString()];
				for (var i = 0; i < current_table.length; i++) {
					if (!collide([pieceMatrix, x + current_table[i][0], y - current_table[i][1], piece])) {
						if (
							(current_table[i][0] === -1 || current_table[i][0] === 1 || current_table[i][0] === 0) &&
							current_table[i][1] === -2
						) {
							lastMoveRotate = 'Force';
						} else {
							lastMoveRotate = true;
						}
						x += current_table[i][0];
						y -= current_table[i][1];
						return true;
					}
				}
				return false;
			}

			function addBag() {
				bag = [...pieces];
				bag.sort(() => Math.random() - 0.5);
				queue = queue.concat(bag);
			}

			function resetBoard() {
				bar = document.getElementById('lines_sent');
				bar.style.backgroundColor = 'lightgreen';
				board = JSON.parse(JSON.stringify(setupData['board']));
				queue = setupData['pieces'].map((x) => x);
				if (queue.length < 10 && cont) {
					addBag();
				}
				piece = queue.shift();
				if (piece == 'O') {
					x = 4;
				} else {
					x = 3;
				}
				y = 0;
				rotation = 0;
				combo = 0;
				pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
				held = setupData['held'];
				b2b = false;
				tasks = JSON.parse(JSON.stringify(all_tasks));
				var taskKeys = Object.keys(goals);
				for (var g = 0; g < taskKeys.length; g++) {
					task_name = taskKeys[g];
					if (document.getElementById(task_name) != null) {
						if (task != 'lines_sent') {
							document.getElementById(
								task_name
							).innerHTML = `${tasks[task_name]}/${goals[task_name]} ${task_names[task_name]}`;
						} else {
							bar = document.getElementById('lines_sent');
							bar.style.width = parseInt((tasks[task_name] / goals[task_name]) * 100) + '%';
						}
					}
				}
			}

			function place(pieceData) {
				//pieceData = [pieceMatrix, x, y, piece]
				piece_stored = piece;
				let filled = 0;
				let mini = 0;
				for (var testY = 0; testY < pieceData[0].length; testY++) {
					for (var testX = 0; testX < pieceData[0][0].length; testX++) {
						if (pieceData[0][testY][testX] != 0) {
							if (pieceData[0][testY][testX] != 9) {
								board[pieceData[2] + testY][pieceData[1] + testX] = pieces.indexOf(pieceData[3]) + 1;
							} else if (board[pieceData[2] + testY][pieceData[1] + testX] == 0) {
								mini++;
							}
						}
						if (pieceData[0][testY][testX] == 0 || pieceData[0][testY][testX] == 9) {
							if (pieceData[3] == 'T') {
								if ((testY == 0 || testY == 2) && (testX == 0 || testX == 2)) {
									if (
										pieceData[2] + testY >= board.length ||
										pieceData[1] + testX >= board[0].length
									) {
										filled++;
									} else if (
										board[pieceData[2] + testY][pieceData[1] + testX] != 0 &&
										board[pieceData[2] + testY][pieceData[1] + testX] != 9
									) {
										filled++;
									}
								}
							}
						}
					}
				}
				let tspin = false;
				let linesCleared = 0;
				if (pieceData[3] == 'T' && filled >= 3 && lastMoveRotate) {
					tspin = true;
				}
				if (lastMoveRotate == 'Force') {
					mini = 0;
				}
				testY = 19;
				temp_board = JSON.parse(JSON.stringify(board));
				while (testY > 0) {
					for (var i = 0; i < 10; i++) {
						if (temp_board[testY][i] == 0) {
							break;
						}
						if (i == 9) {
							board.splice(testY, 1);
							linesCleared += 1;
							if (tasks['lines_cleared'] != goals['lines_cleared']) {
								tasks['lines_cleared']++;
							}
						}
					}
					testY--;
				}
				while (board.length < 20) {
					board.unshift([...empty_line]);
				}
				if (linesCleared == 0) {
					if (tspin == true) {
						if (mini == 0) {
							tasks['tspin']++;
						} else {
							tasks['mini_tspin']++;
						}
					}
				}
				if (linesCleared != 0) {
					combo++;
					tasks['combo']++;
					tasks['lines_sent'] += combo_table[combo];
					if (linesCleared == 1) {
						if (tspin == true) {
							if (b2b == true) {
								tasks['b2b']++;
								tasks['lines_sent'] += 1;
							}
							if (mini == 0) {
								tasks['tspin_single']++;
								tasks['lines_sent'] += 2;
							} else {
								tasks['mini_tspin_single']++;
							}
							b2b = true;
						} else {
							b2b = false;
						}
						tasks['single']++;
					} else if (linesCleared == 2) {
						if (tspin == true) {
							if (b2b == true) {
								tasks['b2b']++;
								tasks['lines_sent'] += 1;
							}
							if (mini == 0) {
								tasks['tspin_double']++;
								tasks['lines_sent'] += 4;
							} else {
								tasks['mini_tspin_double']++;
								tasks['lines_sent'] += 1;
							}
							b2b = true;
						} else {
							b2b = false;
							tasks['lines_sent']++;
						}
						tasks['double']++;
					} else if (linesCleared == 3) {
						if (tspin == true) {
							if (b2b == true) {
								tasks['b2b']++;
								tasks['lines_sent'] += 1;
							}
							tasks['tspin_triple']++;
							tasks['lines_sent'] += 6;
							b2b = true;
						} else {
							b2b = false;
							tasks['lines_sent'] += 2;
						}
						tasks['triple']++;
					} else if (linesCleared == 4) {
						if (b2b == true) {
							tasks['b2b']++;
							tasks['lines_sent'] += 1;
						}
						tasks['tetris']++;
						tasks['lines_sent'] += 4;
						b2b = true;
					}
					pcY = 19;
					let pc = true;
					while (pcY > 0) {
						for (var i = 0; i < 10; i++) {
							if (board[pcY][i] != 0) {
								pc = false;
								break;
							}
						}
						pcY--;
					}
					if (pc) {
						tasks['pc']++;
						tasks['lines_sent'] += 10;
					}
				} else {
					combo = 0;
					tasks['combo'] = 0;
				}

				finished = 0;
				var taskKeys = Object.keys(goals);
				for (var g = 0; g < taskKeys.length; g++) {
					task_name = taskKeys[g];
					if (document.getElementById(task_name) != null) {
						if (task != 'lines_sent') {
							document.getElementById(
								task_name
							).innerHTML = `${tasks[task_name]}/${goals[task_name]} ${task_names[task_name]}`;
						} else {
							bar = document.getElementById('lines_sent');
							bar.style.width = parseInt((tasks[task_name] / goals[task_name]) * 100) + '%';
						}
					}
					if (goals[task_name] <= tasks[task_name]) {
						console.log(
							'Finished puzzle ' +
								data[board_id].id +
								' with goal ' +
								task_name +
								' in ' +
								((new Date().getTime() - start) / 1000).toString() +
								' seconds.'
						);
						finished++;
					}
				}

				validRes = 0;
				var resKeys = Object.keys(restrictions);
				for (var r = 0; r < resKeys.length; r++) {
					if (restrictions[resKeys[r]] == tasks[resKeys[r]]) {
						console.log('Restriction ' + resKeys[r] + ' is valid.');
						validRes++;
					} else {
						console.log('Restriction ' + resKeys[r] + ' is not valid.');
					}
				}

				if (queue.length < 10 && cont) {
					addBag();
				}
				piece = queue.shift();
				if (finished == taskKeys.length && validRes == resKeys.length) {
					graficks();
					completedQuiz();
					return;
				}
				if (piece == null) {
					if (held == null) {
						graficks();
						resetBoard();
						return;
					} else {
						piece = held;
						held = null;
					}
				}

				if (piece == 'O') {
					x = 4;
				} else {
					x = 3;
				}
				y = 0;
				rotation = 0;
				pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
				if (collide([pieceMatrix, x, y, piece])) {
					resetBoard();
					return;
				}
			}

			function graficks() {
				//#909090
				ctx.fillStyle = '#000000';
				ctx.fillRect(102, 2, width, height);
				for (var graphX = 0; graphX < 10; graphX++) {
					ctx.fillStyle = '#202020';
					ctx.fillRect(30 * graphX + 102, 2, 1, 600);
				}
				for (var graphY = 0; graphY < 20; graphY++) {
					ctx.fillStyle = '#202020';
					ctx.fillRect(102, 30 * graphY + 2, 300, 1);
				}
				if (piece != null) {
					ghostY = y;
					while (!collide([pieceMatrix, x, ghostY + 1, piece])) {
						ghostY++;
					}
					for (var testY = 0; testY < pieceMatrix.length; testY++) {
						for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
							if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
								// ctx.drawImage(blocks, 30 * (pieceMatrix[testY][testX] + 1) + 1, 0, 30, 30, (testX + x) * 30, (testY + ghostY) * 30, 30, 30);
								ctx.fillStyle = '#202020';
								ctx.fillRect((testX + x) * 30 + 102, (testY + ghostY) * 30 + 2, 30, 30);
								// viewBoard[testY + y][testX + x] = pieceMatrix[testY][testX]
							}
						}
					}
					ctx.globalAlpha = 1;
				} else {
					pieceMatrix = [[0]];
				}
				for (var testY = 0; testY < pieceMatrix.length; testY++) {
					for (var testX = 0; testX < pieceMatrix[0].length; testX++) {
						if (pieceMatrix[testY][testX] != 0 && pieceMatrix[testY][testX] != 9) {
							// ctx.drawImage(blocks, 30 * (pieceMatrix[testY][testX] + 1) + 1, 0, 30, 30, (testX + x) * 30, (testY + y) * 30, 30, 30);
							ctx.fillStyle = colors[pieceMatrix[testY][testX]];
							ctx.fillRect((testX + x) * 30 + 102, (testY + y) * 30 + 2, 30, 30);
							// viewBoard[testY + y][testX + x] = pieceMatrix[testY][testX]
						}
					}
				}
				for (var pixelY = 0; pixelY < board.length; pixelY++) {
					for (var pixelX = 0; pixelX < board.length; pixelX++) {
						if (board[pixelY][pixelX] != 0) {
							// ctx.drawImage(blocks, 30 * (board[pixelY][pixelX] + 1) + 1, 0, 30, 30, pixelX * 30, pixelY * 30, 30, 30);
							ctx.fillStyle = colors[board[pixelY][pixelX]];
							ctx.fillRect(pixelX * 30 + 102, pixelY * 30 + 2, 30, 30);
						}
					}
				}
				ctx.fillStyle = '#000000';
				ctx.fillRect(402, 2, width, height);
				ctx.fillRect(2, 2, 100, 100);
				ctx.fillStyle = '#d3d3d3';
				ctx.fillRect(402, 2, 2, height);
				ctx.fillRect(101, 2, 2, 100);
				ctx.fillStyle = '#909090';
				ctx.fillRect(101, 104, 2, height);
				ctx.fillRect(0, 102, 103, 2);
				ctx.fillRect(0, 0, 2, 104);
				ctx.fillRect(0, 0, 604, 2);
				ctx.fillRect(502, 0, 2, 604);
				ctx.fillRect(102, 602, 404, 2);
				for (var q = 0; q < queue.length; q++) {
					for (var queueY = 0; queueY < piece_matrix[queue[q]].length; queueY++) {
						for (var queueX = 0; queueX < piece_matrix[queue[q]][0].length; queueX++) {
							if (
								piece_matrix[queue[q]][queueY][queueX] != 0 &&
								piece_matrix[queue[q]][queueY][queueX] != 9
							) {
								color = piece_matrix[queue[q]][queueY][queueX];
								x_displace = 0;
								y_displace = 0;
								if (queue[q] in piece_displacement) {
									x_displace = piece_displacement[queue[q]][0];
									y_displace = piece_displacement[queue[q]][1];
								}
								// ctx.drawImage(blocks, 30 * (color + 1) + 1, 0, 30, 30, queueX * 20 + 321 + x_displace * 20, queueY * 20 + 100 * q + 125 + y_displace * 20, 20, 20);
								ctx.fillStyle = colors[color];
								ctx.fillRect(
									queueX * 20 + 423 + x_displace * 20,
									queueY * 20 + 100 * q + 32 + y_displace * 20,
									20,
									20
								);
							}
						}
					}
				}
				if (held) {
					for (var queueY = 0; queueY < piece_matrix[held].length; queueY++) {
						for (var queueX = 0; queueX < piece_matrix[held][0].length; queueX++) {
							if (piece_matrix[held][queueY][queueX] != 0 && piece_matrix[held][queueY][queueX] != 9) {
								x_displace = 0;
								y_displace = 0;
								if (held in piece_displacement) {
									x_displace = piece_displacement[held][0];
									y_displace = piece_displacement[held][1];
								}
								color = piece_matrix[held][queueY][queueX];
								// ctx.drawImage(blocks, 30 * (color + 1) + 1, 0, 30, 30, queueX * 20 + x_displace * 20 + 321, queueY * 20 + 30 + y_displace * 20, 20, 20);
								ctx.fillStyle = colors[color];
								ctx.fillRect(
									queueX * 20 + 21 + x_displace * 20,
									queueY * 20 + 32 + y_displace * 20,
									20,
									20
								);
							}
						}
					}
				}
			}

			function nextBoard() {
				bar = document.getElementById('lines_sent');
				bar.style.backgroundColor = 'lightgreen';
				//if (!data[board_id]["plays"].includes(userData["userid"])) {
				var http = new XMLHttpRequest();
				http.timeout = 2000;
				http.open('POST', 'saveRush', true);
				http.setRequestHeader('Content-Type', 'application/json');
				sendData = {
					id: data[board_id]['id'],
					win: winning,
					access_token: accessToken,
					token_type: tokenType,
				};
				http.send(JSON.stringify(sendData));
				//}
				ingame = true;
				loadedNext = true;
				keyDict = {};
				document.onkeydown = null;
				document.getElementById('checklist').innerHTML = '';
				board_id++;
				console.log('Started puzzle ' + data[board_id]['id']);
				if (board_id == data.length && lives != 0) {
					return;
				}
				if (lives == 0) {
					return;
				} else {
					timer = setInterval(function () {
						if (countdown <= 0 || lives === 0) {
							lives = 0;
						} else {
							if (document.hidden) {
								countdown -= 10;
							} else {
								countdown--;
							}
							minutes = Math.floor(countdown / 600);
							seconds = countdown / 10 - minutes * 60;
							seconds = seconds.toFixed(1);
							if (seconds < 10) {
								seconds = '0' + seconds;
							}
							document.getElementById('timer').innerHTML = `${minutes}:${seconds}`;
						}
					}, 100);
				}
				setupData = data[board_id];
				combo = 0;
				goals = JSON.parse(JSON.stringify(setupData['goals']));
				for (var task in goals) {
					if (goals.hasOwnProperty(task)) {
						try {
							if (task != 'lines_sent') {
								document.getElementById('checklist').innerHTML += `
            			<h2 class="rush task" id="${task}">${all_tasks[task]}/${goals[task]} ${task_names[task]}</h2>`;
							} else {
								document.getElementById('checklist').innerHTML += `
                <div id="max_lines">
                  <div id="lines_sent"></div>
                </div>
                <h2> Lines Sent </h2>`;
							}
						} catch (e) {
							console.log(e);
						}
					}
				}
				if (setupData.hasOwnProperty('disable_hold')) {
					var disable_hold = true;
					document.getElementById('checklist').innerHTML += `
            <h2 class="task">Hold Disabled</h2>`;
				} else {
					var disable_hold = false;
				}
				board = JSON.parse(JSON.stringify(setupData['board']));
				queue = setupData['pieces'].map((x) => x);
				if (queue.length < 10 && cont) {
					addBag();
				}
				held = setupData['held'];
				if (Math.random() < 0.5) {
					for (let g = 0; g < board.length; g++) {
						for (let h = 0; h < board[g].length; h++) {
							if (Object.keys(pieceValuesReversed).includes(board[g][h].toString())) {
								board[g][h] = pieceValuesReversed[board[g][h].toString()];
							}
						}
						board[g] = board[g].reverse();
					}
					if (held) {
						held = piecesReversed[held];
					}
					for (let h = 0; h < queue.length; h++) {
						queue[h] = piecesReversed[queue[h]];
					}
					setupData['board'] = JSON.parse(JSON.stringify(board));
					setupData['pieces'] = queue.map((x) => x);
					setupData['held'] = held;
				}
				piece = queue.shift();
				b2b = false;
				tasks = {};
				tasks = JSON.parse(JSON.stringify(all_tasks));
				var taskKeys = Object.keys(goals);
				for (var g = 0; g < taskKeys.length; g++) {
					task_name = taskKeys[g];
					if (document.getElementById(task_name) != null && task_name != 'lines_sent') {
						document.getElementById(
							task_name
						).innerHTML = `${tasks[task_name]}/${goals[task_name]} ${task_names[task_name]}`;
					}
				}
				if (piece == 'O') {
					x = 4;
				} else {
					x = 3;
				}
				y = 0;
				rotation = 0;
				lastMoveRotate = false;
				pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
				var start = new Date().getTime();
				piecesPlaced = 0;
				graficks();
			}

			function validCoordinates(matrix, row, col) {
				return row >= 0 && row < matrix.length && col >= 0 && col < matrix[row].length;
			}

			function fillMatrix1(matrix, row, col) {
				if (!validCoordinates(matrix, row, col)) return;

				if (matrix[row][col] != 0) return;

				matrix[row][col] = 1;

				fillMatrix1(matrix, row + 1, col);
				fillMatrix1(matrix, row - 1, col);
				fillMatrix1(matrix, row, col + 1);
				fillMatrix1(matrix, row, col - 1);
			}

			function completedQuiz() {
				//Change these to get the actual index of board instead of board_id
				testBoard = JSON.parse(JSON.stringify(board));
				testY = 19;
				while (testY > 0) {
					if (testBoard[testY].includes(8) || testBoard[testY].includes('8')) {
						testBoard.splice(testY, 1);
					}
					testY--;
				}
				loop: for (var i = 0; i < testBoard.length; i++) {
					for (var j = 0; j < testBoard[i].length; j++) {
						if (testBoard[i][j] == 0) {
							fillMatrix1(testBoard, i, j);
							break loop;
						}
					}
				}

				for (var i = 0; i < testBoard.length; i++) {
					for (var j = 0; j < testBoard[i].length; j++) {
						if (testBoard[i][j] == 0) {
							//gameOver()
							resetBoard();
							console.log('holes');
							return;
						}
					}
				}

				sendStr = `
        <div class="tracked correct" id="${board_id}">
        <img src="./checkmark.svg" alt="" class="trackedIcon">${board_id + 1}
        </div>`;
				completedTracker.insertAdjacentHTML('beforeend', sendStr);
				$(`#${board_id}`).fadeIn();
				completed_counter = parseInt(document.getElementById('completedCounter').innerHTML) + 1;
				document.getElementById('completedCounter').innerHTML = completed_counter;
				if (completed_counter == 1) {
					document.getElementById('grammar').innerHTML = 'puzzle';
				}
				if (completed_counter == 2) {
					document.getElementById('grammar').innerHTML = 'puzzles';
				}
				winning = true;
				ingame = false;
				loadedNext = false;
				clearInterval(timer);
				sleep(1000).then(() => {
					if (!loadedNext) {
						nextBoard();
					}
				});
				document.onkeydown = function (f) {
					if (!loadedNext) {
						nextBoard();
					}
				};
			}

			function gameOver() {
				//Change these to get the actual index of board instead of board_id
				lives--;
				sendStr = `<div class="tracked incorrect" id="${board_id}">
        <img src="./crossmark.png" class="trackedIcon">${board_id + 1}
        </div>`;
				temp = completedTracker.insertAdjacentHTML('beforeend', sendStr);
				$(`#${board_id}`).fadeIn();
				winning = false;
				ingame = false;
				loadedNext = false;
				bar = document.getElementById('lines_sent');
				bar.style.background = '#EE9090';
				clearInterval(timer);
				sleep(1000).then(() => {
					if (!loadedNext) {
						nextBoard();
					}
				});
				document.onkeydown = function (f) {
					if (!loadedNext) {
						nextBoard();
					}
				};
			}

			function move(key) {
				if (ingame) {
					var keys = Object.keys(controls);
					for (var i = 0; i < keys.length; i++) {
						if (controls[keys[i]][0] == parseInt(key)) {
							move_type = keys[i];
							eval(move_type + '()');
							//console.log(piece);
							pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
							for (var j = 0; j < rotation; j++) {
								rotate(pieceMatrix);
							}
							graficks();
						}
					}
				}

				function restart() {
					resetBoard();
				}

				function skip() {
					if (lives > 1) {
						gameOver();
					}
				}

				function clockwise() {
					if (rotation < 3) {
						rotation++;
					} else {
						rotation = 0;
					}
				}

				function counterclockwise() {
					if (rotation > 0) {
						rotation--;
					} else {
						rotation = 3;
					}
				}

				function hold() {
					if ((queue.length == 0 && held == null) || disable_hold) {
						if (piece == 'O') {
							x = 4;
						} else {
							x = 3;
						}
						y = 0;
						rotation = 0;
						return;
					}
					if (held == null || held == '') {
						held = piece;
						piece = queue.shift();
						if (queue.length < 10 && cont) {
							addBag();
						}
					} else {
						[held, piece] = [piece, held];
					}
					if (piece == 'O') {
						x = 4;
					} else {
						x = 3;
					}
					y = 0;
					rotation = 0;
				}

				function softdrop() {
					if (fall_speed == 0) {
						while (!collide([pieceMatrix, x, y + 1, piece])) {
							y++;
							lastMoveRotate = false;
						}
					} else if (!collide([pieceMatrix, x, y + 1, piece])) {
						y++;
						lastMoveRotate = false;
					}
				}

				function move_right() {
					if (!collide([pieceMatrix, x + 1, y, piece])) {
						x++;
						lastMoveRotate = false;
					}
				}

				function move_left() {
					if (!collide([pieceMatrix, x - 1, y, piece])) {
						x--;
						lastMoveRotate = false;
					}
				}

				function rotate_left() {
					old_rotation = rotation;
					counterclockwise();
					pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
					for (var j = 0; j < rotation; j++) {
						rotate(pieceMatrix);
					}
					if (!tryWallkick(old_rotation, rotation)) {
						clockwise();
					}
				}

				function rotate_right() {
					old_rotation = rotation;
					clockwise();
					pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
					for (var j = 0; j < rotation; j++) {
						rotate(pieceMatrix);
					}
					if (!tryWallkick(old_rotation, rotation)) {
						counterclockwise();
					}
				}

				function rotate_180() {
					old_rotation = rotation;
					rotation = (rotation + 2) % 4;
					pieceMatrix = JSON.parse(JSON.stringify(piece_matrix[piece]));
					for (var j = 0; j < rotation; j++) {
						rotate(pieceMatrix);
					}
					if (!tryWallkick(old_rotation, rotation)) {
						rotation = old_rotation;
					}
				}

				function harddrop() {
					let dropY = y;
					while (!collide([pieceMatrix, x, dropY + 1, piece])) {
						dropY++;
						lastMoveRotate = false;
					}
					piecesPlaced++;
					place([pieceMatrix, x, dropY, piece]);
					lastMoveRotate = false;
				}
			}
		}
	}
});
