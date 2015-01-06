$(document).ready(function () {
    var svg = SVG($(".graph").get(0)).size("100%", "100%");
    var links = svg.group();
    var markers = svg.group();
    var nodes = svg.group();

    var g1 = nodes.group().translate(300, 200);
    g1.circle(80).fill("#C2185B");

    var g2 = nodes.group().translate(100, 200);
    g2.circle(50).fill("#E91E63");

    var g3 = nodes.group().translate(200, 400);
    g3.circle(100).fill("#FF5252");

    nodes.panZoom();
});
