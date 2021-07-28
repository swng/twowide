show_create = [224514766486372352, 324443201903788042, 290703619630563328, 489597258451386420, 345879198331699213];
if (localStorage.getItem('controls') === null) {
	let defaultControls = {
		move_left: [37, 'ArrowLeft'],
		move_right: [39, 'ArrowRight'],
		rotate_left: [83, 's'],
		rotate_right: [38, 'ArrowUp'],
		softdrop: [40, 'ArrowDown'],
		harddrop: [32, ' '],
		hold: [67, 'c'],
		restart: [115, 'F4'],
		DAS: 200,
		ARR: 10,
	};
	localStorage.setItem('controls', JSON.stringify(defaultControls));
}

controls = JSON.parse(localStorage.getItem('controls'));

if (!('restart' in controls)) {
	controls['restart'] = [115, 'F4'];
	localStorage.setItem('controls', JSON.stringify(controls));
}

var userData;

if (localStorage.getItem('userData') === null || localStorage.getItem('userData') == '') {
	let userData = {
		history: {},
	};
	localStorage.setItem('userData', JSON.stringify(userData));
} else {
	userData = JSON.parse(localStorage.getItem('userData'));
}

window.onload = () => {
	var fragment = new URLSearchParams(window.location.hash.slice(1));
	if (localStorage.getItem('discord_info') != null) {
		var fragment = localStorage.getItem('discord_info');
		fragment = new URLSearchParams(fragment);
	} else {
		if (userData['username'] != undefined) {
			alert('Token has expired, please login again.');

			let userData = {
				history: {},
			};
			localStorage.setItem('userData', JSON.stringify(userData));
		}
	}
	if (fragment.has('access_token')) {
		localStorage.setItem('discord_info', fragment);
		const accessToken = fragment.get('access_token');
		const tokenType = fragment.get('token_type');
		fetch('https://discordapp.com/api/users/@me', {
			headers: {
				authorization: `${tokenType} ${accessToken}`,
			},
		})
			.then((res) => res.json())
			.then((response) => {
				const { username, avatar, id } = response;
				if (username == undefined) {
					document.getElementById('login').style.display = 'block';
					localStorage.removeItem('discord_info');
					return;
				}
				document.getElementById('info').innerHTML = 'Profile';
				//document.getElementById('icon').src = ` https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`;
				checkImage(`https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`);
				document.getElementById('login').href = 'profile?userid=' + id;

				// if (userData["userid"]) {
				//   userData["tokenType"] = tokenType
				//   userData["accessToken"] = accessToken
				//   var http = new XMLHttpRequest();
				//   http.open("POST", "tempSave", true);
				//   http.setRequestHeader('Content-Type', 'application/json');
				//   http.send(JSON.stringify(userData));
				// }

				var url = 'getprofile';
				var params = `userid=${id}&avatar=${avatar}&username=${username}`;
				var http = new XMLHttpRequest();
				var headers = new Headers();
				http.open('GET', url + '?' + params, true);
				http.setRequestHeader('Authorization', accessToken + ':' + tokenType);
				http.onreadystatechange = function () {
					if (http.readyState == 4 && http.status == 200) {
						var x = http.responseText;
						var data = JSON.parse(http.responseText);
						var history = data['history'];
						history = history.replace(/\\"/g, '"');
						data['history'] = JSON.parse(history);
						localStorage.setItem('userData', JSON.stringify(data));
						for (userId of show_create) {
							if (userId == data['userid']) {
								document.getElementById('create').style.display = 'block';
								dels = document.getElementsByClassName('delete');
								if (dels.length != 0) {
									for (var i = 0; i < dels.length; i++) {
										dels[i].style.display = 'block';
									}
								}
							}
						}
					}
				};
				http.send(null);
			})
			.catch(console.error);
	} else {
		document.getElementById('login').style.display = 'block';
	}
};

function checkImage(url) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.send();
	request.onload = function () {
		status = request.status;
		if (request.status == 200) {
			//if(statusText == OK)
			console.log('image exists');
			document.getElementById('icon').src = url;
		} else {
			console.log("image doesn't exist");
			document.getElementById('icon').src = 'https://discordapp.com/assets/322c936a8c8be1b803cd94861bdfa868.png';
		}
	};
}
