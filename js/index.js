window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function( callback ) {
					window.setTimeout( callback, 1000 / 60 );
				};
})();

var canvas = document.getElementById('canvas'), 
		ctx = canvas.getContext('2d'), 
		canvasWidth = window.innerWidth, 
		canvasHeight = window.innerHeight, 
		points = [], 
		timerTick = 0, 
		timerLimit = 275, 
		mousedown = false,
		// mouse x coordinate,
		mx,
		// mouse y coordinate
		my;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

		// get a random number within a range
function random( min, max ) {
	return Math.random() * ( max - min ) + min;
}

// calculate the distance between two points
function calculateDistance( p1x, p1y, p2x, p2y ) {
	var xDistance = p1x - p2x,
			yDistance = p1y - p2y;
	return Math.sqrt( Math.pow( xDistance, 2 ) + Math.pow( yDistance, 2 ) );
}

function DataPoint() {
	// actual coordinates
	this.x = canvasWidth;
	this.y = random(20, canvasHeight - 20);
	this.color = '#B2B7E8';
	this.lifespan = 0;
	this.radius = 0.1;
	this.dancingY = 15;
	this.hue = 235;
	this.sat = 100;
	this.lightness = 35;
}

function createPoints() {
	var i = 400;
	while (i--) {
		points.push(new DataPoint());
		newPoint = new DataPoint();
		newPoint.hue = random(newPoint.hue - 25, newPoint.hue + 25);
		newPoint.y -= 10;
		points.push(newPoint);
	}
	
}

DataPoint.prototype.update = function() {
		this.x = random(this.x - 11.5, this.x - 4.5);
		this.y = random(this.y - this.dancingY, this.y + this.dancingY);
		this.lifespan++;
}

// draw ripple
DataPoint.prototype.draw = function() {
	if (this.lifespan <= 150) {
		this.radius += 0.1;
		this.sat += 0.25;
		this.lightness += 0.2;
		ctx.fillStyle = 'hsl('+ this.hue + ', ' + this.sat + '%, ' + this.lightness + '%)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'hsl('+ this.hue + ', ' + this.sat + '%, ' + this.lightness + '%)';
		ctx.stroke();
		ctx.fill();
	} else {
		this.radius -= 0.02;
		this.sat -= 0.15;
		this.lightness -= 0.2;
		ctx.fillStyle = 'hsl('+ this.hue + ', ' + this.sat + '%, ' + this.lightness + '%)';
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		ctx.strokeStyle = 'hsl('+ this.hue + ', ' + this.sat + '%, ' + this.lightness + '%)';
		ctx.stroke();
		ctx.fill();
	}
}

//createPoints();

function mouseMover() {
	var j = points.length;
	while (j--) {
		if (calculateDistance(mx, my, points[j].x, points[j].y) < 70) {
			points[j].x = random(points[j].x - 2, points[j].x + 2);
			points[j].y = random(points[j].y - 2, points[j].y + 2);
			points[j].radius += 0.1;
			points[j].sat -= 0.1;
			points[j].lightness -= 0.1;
			// points[j].update();
		} else {
			points[j].color = '#ffffff';
		}
	}
}

// main demo loop
function loop() {
	// this function will run endlessly with requestAnimationFrame
	requestAnimFrame(loop);
	// normally, clearRect() would be used to clear the canvas
	// we want to create a trailing effect though
	// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
	ctx.globalCompositeOperation = 'destination-out';
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
	ctx.fillRect( 0, 0, canvasWidth, canvasHeight );
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = 'lighter';
	
	if (mousedown) {
		points.push(new DataPoint());
		points[points.length - 1].x = mx;
		points[points.length - 1].y = my;
		points[points.length - 1].hue = 358;
		points[points.length - 1].lightness = 15;
	}
	
	var i = points.length;
	while(i--) {
		if (points[i].lifespan <= 400) {
			points[i].draw();
			points[i].lifespan++;
			points[i].update();
		}
	}
	
	if (timerTick % 200 == 0) {
		timerTick = 0;
		createPoints();
	}
		timerTick++;	
}

// mouse event bindings
// update the mouse coordinates on mousemove
canvas.addEventListener('mousemove', function(e) {
	mx = e.pageX - canvas.offsetLeft;
	my = e.pageY - canvas.offsetTop;
});

canvas.addEventListener('mouseenter', function(e) {
	e.preventDefault();
	mouseenter = true;
});


// toggle mousedown state and prevent canvas from being selected
canvas.addEventListener('mousedown', function(e) {
	e.preventDefault();
	mousedown = true;
});
canvas.addEventListener( 'mouseup', function( e ) {
	e.preventDefault();
	mousedown = false;
});
window.onload = loop;