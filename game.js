// Cache stuff.
var pop = createPop();
var base = null;

// Start music, TEST!
var player = new CPlayer();
player.init(song);

// Generate music...
var done = false;
setInterval(function () {
	if (done) {
      	return;
    }

    done = player.generate() >= 1;

    if (done) {
		var wave = player.createWave();
		var audio = document.createElement("audio");
		audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
		audio.play();
    }
}, 0);

// Disables right click context menu.
AddEventListener("contextmenu", function(e) {
	e.preventDefault();
});

// Setup planets (procgen this?)
var s = Orbital.sun(getHSL(60, 100, 50), 50, 0, 0);
var s1 = Orbital.planet(getHSL(180, 39, 62), 10, s, 500, 0.003, rand() * cr);
base = Base(s1);
var s1a = Orbital.planet(getHSL(-1,60,70), 5, s1, 100, -0.002, rand() * cr);
var s2 = Orbital.planet(getHSL(-1,60,70), 20, s, 1123, 0.0015, rand() * cr);
var s2a = Orbital.planet(getHSL(-1,60,70), 5, s2, s2.size * 8, 0.01, rand() * cr);
var s2b = Orbital.planet(getHSL(-1,60,70), 10, s2, s2.size * 9, 0.005);
var s3 = Orbital.planet(getHSL(-1,60,70), 30, s, 2532, -0.001, rand() * cr);
var ms = Orbital.miningStation(s1);
var ms2 = Orbital.miningStation(s2);
var st = Orbital.satellite(s1);
var st1 = Orbital.satellite(s);
var st2 = Orbital.satellite(s);
var st3 = Orbital.satellite(s);
var st4 = Orbital.satellite(s2);
var st5 = Orbital.satellite(s2);
var st6 = Orbital.satellite(s2);
var ds = Orbital.defenseStation(s1);
var ds1 = Orbital.defenseStation(s1);
var ds2 = Orbital.defenseStation(s1);
var ds3 = Orbital.defenseStation(s2);

// Update game.
var lastTick = performance.now();
var tickLength = 1000 / 60; // Logic steps per second
var last = 0;
var fps = 0;
var allFps = [];
(function frame(timestamp) {

	requestAnimationFrame(frame);
	var nextTick = lastTick + tickLength;
	allFps.push(1 / ((timestamp - last) / 1000));
	last = timestamp;
	if (allFps.length > 60) {
		var sum = 0;
		var min = 1000;
		var max = 0;
		allFps.shift();
		allFps.forEach(function(value) {
			sum += value;
			min = Math.min(min, value);
			max = Math.max(max, value);
		});
		fps = Math.floor(sum / 60) + ", " + ~~min + " - " + ~~max;
	}

	if (timestamp > nextTick) {
		var timeSinceTick = timestamp - lastTick;
		var numTicks = Math.floor(timeSinceTick / tickLength);
		update(Math.min(numTicks, 60));
		lastTick = timestamp;
	}

	render();

})(lastTick);

function update(repeat) {
	hoverName = "";
	View.update();
	gui.forEach(function(e) { e.update(); });
	orbitals.forEach(function(e) { e.update(); });
	Mouse.update();
	--repeat && update(repeat);
}

function render() {
	View.clear();

	ctx.save();
	ctx.beginPath();
	var x = Canvas.width / 2 - View.x;
	var y = Canvas.height / 2 - View.y;
	var grd = ctx.createRadialGradient(x, y, 0, x, y, 4000);
	grd.addColorStop(0, "#141e28");
	grd.addColorStop(1, "#000000");
	ctx.fillStyle = grd;
	ctx.rect(0, 0, Canvas.width, Canvas.height);
	ctx.fill();
	ctx.restore()

	View.reset();
	drawStarscape();
	View.position();

	orbitals.forEach(function(e) { e.render(); });
	ctx.setTransform(1, 0, 0, 1, Canvas.width / 2, Canvas.height / 2);
	gui.forEach(function(e) { e.render(); });
	View.reset();
	drawDebug();
}
