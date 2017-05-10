# iceberg.hockey


Technical task:

Необходимо реализовать отображение набора точек с лейблами на плоскости.

Вход:
Входными данными является набор точек плоскости вида Array< { x: number, y: number, label: string } >, где (x,y) - координата точки на плоскости, label - строковый лейбл точки.

Выход:
Вывести точки на html-странице, а также их лейблы. НЕ отображать лейбл, если он перекрывает одну из точек или другой лейбл.

###############################################################

Description:

This script draws axises, dots and labels on the canvas. Here are some features:

1. Dots are set up with random coordinates;

2. One intersection of coordinates can't contain two or more dots at the same time;

3. Label should't be shown if it overlaps dot or another label.
