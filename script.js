const xPadding = 30, yPadding = 30;
const letterwidth = 2.75;
var graph = document.getElementById("graph");
var c, r;
var textrect;
var indexX, indexY;
var labX, labY; // coordinates of label placement
var randValueX, randValueY; // random values from data.coordinates array
var over; // indicator of overlapping
var data = {
			coordinates: [ { X: 1, Y: 10 }, { X: 2, Y: 20 }, { X: 3, Y: 30 }, { X: 4, Y: 40 }, { X: 5, Y: 50 }, { X: 6, Y: 60 }, { X: 7, Y: 70 }, { X: 8, Y: 80 }, { X: 9, Y: 90 }, { X: 10, Y: 100 } ],
			labels:      ["oilers", "blues", "devils", "rangers", "ducks", "flyers", "bruins", "panthers", "stars", "coyotes"],
			colors:      ["red", "orange", "yellow", "green", "blue", "navy", "violet", "pink", "gray", "black"]
		   };  // collection of data
var overlaparr = []; // array of overlappings

// Fills overlaparr array with zero (0 - no overlaping)
function setZeroArr(rows, cols) {
	var row = [];
	
	while (cols--) row.push(0);
	while (rows--) overlaparr.push(row.slice());

	return overlaparr;
}

// Returns the max X value in data list
function getMaxX() {
	var max = 0;

	for (var i = 0; i < data.coordinates.length; i++) {
		if (data.coordinates[i].X > max) {
			max = data.coordinates[i].X;
		}
	}

	max += 10 - max % 10;
	return max;
}

// Returns the max Y value in data list
function getMaxY() {
	var max = 0;

	for (var i = 0; i < data.coordinates.length; i++) {
		if (data.coordinates[i].Y > max) {
			max = data.coordinates[i].Y;
		}
	}

	max += 10 - max % 10;
	return max;
}

// Returns the x pixel for a graph point
function getXPixel(val) {
	return ((graph.width - xPadding) / getMaxX()) * val + (xPadding);
}

// Returns the y pixel for a graph point
function getYPixel(val) {
	return graph.height - (((graph.height - yPadding) / getMaxY()) * val) - yPadding;
}

// Draws graph with axes
function drawGraph() {

	c = graph.getContext('2d');

	c.lineWidth = 2;
	c.strokeStyle = '#333';
	c.font = 'italic 8pt sans-serif';
	c.textAlign = "center";

	// Draws the axises
	c.beginPath();
	c.moveTo(xPadding, 0);
	c.lineTo(xPadding, graph.height - yPadding);
	c.lineTo(graph.width, graph.height - yPadding);
	c.stroke();

	// Draws the X value texts
	for (i = 0; i < getMaxX() - 9; i++) {
		c.fillText(i, getXPixel(i), graph.height - yPadding + 20);
	}

	// Draws the Y value texts
	c.textAlign = "right";
	c.textBaseline = "middle";

	for (i = 0; i < getMaxY(); i += 10) {
		c.fillText(i, xPadding - 10, getYPixel(i));
	}

	c.strokeStyle = '#f00';
	
}

// Draws labels
function drawLabels(startX, startY, width, height, text, pos) {

	labX = startX + width * letterwidth;
	labY = startY + height / 2;

	r = graph.getContext('2d');
	r.fillStyle = "#333";
	r.fillText(text, labX, labY);
	
}

// Marks all taken dots and nearby areas as busy to avoid overlapping
function detectTakenDots(x, y, over) {

	if (over == 0) {
		if (x > 0 && y > 1 && x < data.coordinates.length) {
			overlaparr[x][y - 2] = 1;
			overlaparr[x - 1][y - 2] = 1;
		} else if (x > 0 && y > 1) {
			overlaparr[x - 1][y - 2] = 1;
		}

		if (x > 1 && y > 1) {
			overlaparr[x - 2][y - 2] = 1;
		}
	}

	overlaparr[x - 1][y - 1] = 1;

}

// Checks overlapping
function checkOverlapping(x, y) {

	over = 0;

	if ( (x > 1 && x < data.coordinates.length && y > 1 && (overlaparr[x - 1][y - 2] || overlaparr[x - 2][y - 2] || overlaparr[x - 1][y - 1] || overlaparr[x][y - 2])) || (x == 1 && (overlaparr[x - 1][y - 2] || overlaparr[x][y - 2] || overlaparr[x - 1][y - 1])) || y == 1 || (x == data.coordinates.length && (overlaparr[x - 1][y - 2] || overlaparr[x - 2][y - 2] || overlaparr[x - 1][y - 1])) ) {
		over = 1;
	}

	return over;
	
}

// Sets dots on the canvas
function drawDots() {

	for (i = 0; i < data.coordinates.length; i++) {
		randValueX = data.coordinates[Math.floor(Math.random() * data.coordinates.length)].X;
		randValueY = data.coordinates[Math.floor(Math.random() * data.coordinates.length)].Y;
		
		// Gets index in array of selected value
		function whatIndex(axis) {
			for (j = 0; j < data.coordinates.length; j++) {
				if (axis == "X") {
					if (data.coordinates[j].X == randValueX) {
						return j;
					}
				} else {
					if (data.coordinates[j].Y == randValueY) {
						return j;
					}
				}
			}
		}
		
		indexX = data.coordinates[whatIndex("X")].X;
		indexY = data.coordinates[whatIndex("Y")].Y;

		//change coordinates if dot overlaps another dot
		if (overlaparr[(indexX) - 1][(indexY / 10) - 1]) {
			do {
				randValueX = data.coordinates[Math.floor(Math.random() * data.coordinates.length)].X;
				randValueY = data.coordinates[Math.floor(Math.random() * data.coordinates.length)].Y;
				indexX = data.coordinates[whatIndex("X")].X;
				indexY = data.coordinates[whatIndex("Y")].Y;
			} while (overlaparr[(indexX) - 1][(indexY / 10) - 1]);
		}

		c.beginPath();
		c.fillStyle = data.colors[i];
		c.arc(getXPixel(indexX), getYPixel(indexY), 4, 0, Math.PI * 2, true);
		c.fill();

		textrect = data.labels[i];

		over = checkOverlapping(indexX, indexY / 10);

		detectTakenDots(indexX, indexY / 10, over);
		
		if (over == 0) {
			drawLabels(getXPixel(indexX), getYPixel(indexY), textrect.length, 20, textrect, i);
		}
	}
	
}

// Draws matrix of dots for clarity
function drawMatrix() {

	for (i = 0; i < data.coordinates.length; i++) {
		for (j = 0; j < data.coordinates.length; j++) {
			c.beginPath();

			if (overlaparr[i][j] == 0) {
				c.fillStyle = "black";
				c.arc(getXPixel(data.coordinates[i].X), getYPixel(data.coordinates[j].Y), 1, 0, Math.PI * 2, true);
				c.fill();
			}

		}
	}
	
}

setZeroArr(getMaxX(), getMaxY());
drawGraph();
drawDots();
drawMatrix();