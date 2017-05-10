const XPADDING = 30, YPADDING = 30; // paddings of axises on canvas
const GRAPH = document.getElementById("graph"); // canvas
const C = GRAPH.getContext("2d"); // context of drawing on canvas

var data = {
             coordinates: [ { X: 1, Y: 10 }, { X: 2, Y: 20 }, { X: 3, Y: 30 }, { X: 4, Y: 40 }, { X: 5, Y: 50 }, { X: 6, Y: 60 }, { X: 7, Y: 70 }, { X: 8, Y: 80 }, { X: 9, Y: 90 }, { X: 10, Y: 100 } ],
             labels:      ["oilers", "blues", "devils", "rangers", "ducks", "flyers", "bruins", "panthers", "stars", "coyotes"],
             colors:      ["red", "orange", "yellow", "green", "blue", "navy", "violet", "pink", "gray", "black"]
            };  // collection of data

// Fills overlap_arr array with zero (0 - no overlaping) 
function emptyOverlapArrayFrom(coordinates) {
    var array = [];
    var xyvalue = getMaxXY(coordinates);
    var rows = xyvalue.X, cols = xyvalue.Y;
    var row = [];

    while (cols--) row.push(0);
    while (rows--) array.push(row.slice());

    return array;
}

// Returns the max X or Y value from data list
function getMaxXY(array) {
    var maximum_x = 0;
    var maximum_y = 0;

    for (var i = 0; i < array.length; i++) {
        maximum_x = array[i].X;
        maximum_y = array[i].Y;
    }

    maximum_x += 10 - maximum_x % 10;
    maximum_y += 10 - maximum_y % 10;

    return {
        X: maximum_x,
        Y: maximum_y
    };
}

// Returns the x pixel for a GRAPH point
function getXPixel(val, coordinates) {
    var xyvalue = getMaxXY(coordinates);
    return ((GRAPH.width - XPADDING) / xyvalue.X) * val + (XPADDING);
}

// Returns the y pixel for a GRAPH point
function getYPixel(val, coordinates) {
    var xyvalue = getMaxXY(coordinates);
    return GRAPH.height - (((GRAPH.height - YPADDING) / xyvalue.Y) * val) - YPADDING;
}

// Draws GRAPH with axes
function drawGRAPH(context, coordinates) {

    context.lineWidth = 2;
    context.strokeStyle = "#333";
    context.font = "italic 8pt sans-serif";
    context.textAlign = "center";

    // Draws the axises
    context.beginPath();
    context.moveTo(XPADDING, 0);
    context.lineTo(XPADDING, GRAPH.height - YPADDING);
    context.lineTo(GRAPH.width, GRAPH.height - YPADDING);
    context.stroke();

    var xyvalue = getMaxXY(coordinates);

    // Draws the X value texts
    for (var i = 0; i < xyvalue.X - 9; i++) {
        context.fillText(i, getXPixel(i, data.coordinates), GRAPH.height - YPADDING + 20);
    }

    // Draws the Y value texts
    context.textAlign = "right";
    context.textBaseline = "middle";

    for (var i = 0; i < xyvalue.Y; i += 10) {
        context.fillText(i, XPADDING - 10, getYPixel(i, data.coordinates));
    }

    context.strokeStyle = "#f00";

}

// Draws labels
function drawLabels(context, startX, startY, width, height, text) {

    // coordinates of label placement
    var lab_x = startX + width * 2.75;
    var lab_y = startY + height / 2;

    context.fillStyle = "#333";
    context.fillText(text, lab_x, lab_y);

}

// Marks all taken dots and nearby areas as busy to avoid overlapping
function detectTakenDots(array, x, y, over) {

    if (!over) {
        if (x > 0 && y > 1 && x < array.length) {
            overlap_arr[x][y - 2] = true;
            overlap_arr[x - 1][y - 2] = true;
        } else if (x > 0 && y > 1) {
            overlap_arr[x - 1][y - 2] = true;
        }

        if (x > 1 && y > 1) {
            overlap_arr[x - 2][y - 2] = true;
        }
    }

    overlap_arr[x - 1][y - 1] = true;

}

// Checks overlapping
function checkOverlapping(coordinates, x, y) {
    return ((x > 1 && x < coordinates.length && y > 1 && (overlap_arr[x - 1][y - 2] || overlap_arr[x - 2][y - 2] || overlap_arr[x - 1][y - 1] || overlap_arr[x][y - 2])) || (x == 1 && (overlap_arr[x - 1][y - 2] || overlap_arr[x][y - 2] || overlap_arr[x - 1][y - 1])) || y == 1 || (x == coordinates.length && (overlap_arr[x - 1][y - 2] || overlap_arr[x - 2][y - 2] || overlap_arr[x - 1][y - 1])));
}

// Drawing dots on canvas routine
function setDotsOnCanvas(color, x, y, radius, startingAngle) {
    C.fillStyle = color;
    C.arc(x, y, radius, startingAngle, Math.PI * 2, true);
    C.fill();
}

// Sets dots on the canvas
function drawDots(context, coordinates, labels) {

    var rand_value_x = 0,
        rand_value_y = 0; // random values from data.coordinates array 

    for (var i = 0; i < coordinates.length; i++) {
        rand_value_x = coordinates[Math.floor(Math.random() * coordinates.length)].X;
        rand_value_y = coordinates[Math.floor(Math.random() * coordinates.length)].Y;

        // Gets index in array of selected value
        function whatIndex(axis) {
            for (var j = 0; j < coordinates.length; j++) {
                if (axis) {
                    if (coordinates[j].X == rand_value_x) {
                        return j;
                    }
                } else {
                    if (coordinates[j].Y == rand_value_y) {
                        return j;
                    }
                }
            }
        }

        var index_x = coordinates[whatIndex(true)].X;
        var index_y = coordinates[whatIndex(false)].Y;
        var text_rect = labels[i];

        //change coordinates if dot overlaps another dot
        if (overlap_arr[(index_x) - 1][(index_y / 10) - 1]) {
            do {
                rand_value_x = coordinates[Math.floor(Math.random() * coordinates.length)].X;
                rand_value_y = coordinates[Math.floor(Math.random() * coordinates.length)].Y;
                index_x = coordinates[whatIndex(true)].X;
                index_y = coordinates[whatIndex(false)].Y;
            } while (overlap_arr[(index_x) - 1][(index_y / 10) - 1]);
        }

        context.beginPath();
        setDotsOnCanvas(data.colors[i], getXPixel(index_x, coordinates), getYPixel(index_y, coordinates), 4, 0);

        var over = checkOverlapping(coordinates, index_x, index_y / 10);

        detectTakenDots(coordinates, index_x, index_y / 10, over);

        if (!over) {
            drawLabels(C, getXPixel(index_x, coordinates), getYPixel(index_y, coordinates), text_rect.length, 20, text_rect, i);
        }
    }

}

// Draws matrix of dots for clarity
function drawMatrix(context, coordinates) {

    for (var i = 0; i < coordinates.length; i++) {
        for (var j = 0; j < coordinates.length; j++) {
            context.beginPath();

            if (overlap_arr[i][j] == 0) {
                setDotsOnCanvas("black", getXPixel(coordinates[i].X, coordinates), getYPixel(coordinates[j].Y, coordinates), 1, 0);
            }

        }
    }

}

var overlap_arr = emptyOverlapArrayFrom(data.coordinates); // array of overlappings
drawGRAPH(C, data.coordinates);
drawDots(C, data.coordinates, data.labels);
drawMatrix(C, data.coordinates);
