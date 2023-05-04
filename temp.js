controls = {
	move_left: [74, 'j'],
	move_right: [76, 'l'],
	rotate_left: [83, 's'],
	rotate_right: [70, 'f'],
    rotate_180: [68, 'd'],
	softdrop: [75, 'k'],
	harddrop: [32, ' '],
	hold: [65, 'a'],
	restart: [82, 'r'],
	skip: [84, 't'],
	reset: [89, 'u'],
	DAS: 70,
	ARR: 0,
    grav_ARR: 0,
};

localStorage.setItem('controls', JSON.stringify(controls));