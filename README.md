# iceberg.hockey


Technical task:

Array of dots with labels should be displayed on the plane.

Input:
Input is the set of dots on the plane Array< { x: number, y: number, label: string } >, where (x, y) - coordinates of dots on the plane, label - string label of dot.

Output:
Output dots with labels on html-page. Do NOT display labels if they overlapping another dot or another label.

###############################################################

Description:

This script draws axises, dots and labels on the canvas. Here are some features:

1. Dots are set up with random coordinates;

2. One intersection of coordinates can't contain two or more dots at the same time;

3. Label should't be shown if it overlaps dot or another label.
