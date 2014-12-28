;(function() {

    var container = null;
    var markers = null;

    var mousewheel = "onwheel" in document.createElement("div") ? "wheel" :
            document.onmousewheel !== undefined ? "mousewheel" :
            "DOMMouseScroll";

    function panZoom() {
        var pz = {
            pan: {}
        };
        var self = this;
        pz.elm = self;
        var svg = self;
        while ((svg = self.parent).node.tagName.toUpperCase() !== "SVG") {}
        var rect = new SVG(document.createDocumentFragment()).rect().attr({
            width: svg.width(),
            height: svg.height(),
            fill: "none"
        }).style("pointer-events", "all");
        self.parent.node.insertBefore(rect.node, self.node)

        function updateMatrix() {
            self.matrix([
                pz.transform.scaleX, 0, 0,
                pz.transform.scaleY, pz.transform.x, pz.transform.y
            ].join(","));
        }

        function pan(e) {
            if (!pz.pan.mousedown) {
                return;
            }
            var tr = pz.transform = self.transform();
            var diffX = (pz.pan.fPos.x - pz.pan.iPos.x) / (tr.scaleX * 2);
            var diffY = (pz.pan.fPos.y - pz.pan.iPos.y) / (tr.scaleY * 2);
            tr.x += diffX;
            tr.y += diffY;
            pz.pan.iPos = pz.pan.fPos;
            self.node.dispatchEvent(new CustomEvent("pan", e, tr));
            updateMatrix();
        }

        function zoom (e) {
            var tr = pz.transform = self.transform();
            var d = e.deltaY / 1000
            var scale = tr.scaleX + d;

            var oX = e.clientX;
            var oY = e.clientY;

            var scaleD = scale / tr.scaleX;
            var currentX = tr.x;
            var currentY = tr.y;
            var x = scaleD * (currentX - oX) + oX;
            var y = scaleD * (currentY - oY) + oY;


            tr.scaleY = tr.scaleX = scale;
            tr.x = x;
            tr.y = y;

            self.node.dispatchEvent(new CustomEvent("zoom", e, tr));
            updateMatrix();
        }

        rect.on(mousewheel, zoom);
        rect.on("mousedown", function (e) {
            pz.pan.mousedown = true;
            pz.pan.iPos = {
                x: e.clientX,
                y: e.clientY
            };
        }).on("mousemove", function (e) {
            pz.pan.fPos = {
                x: e.clientX,
                y: e.clientY
            };
            pan();
        }).on("mouseup", function (e) {
            pz.pan.mousedown = false;
            pz.pan.fPos = {
                x: e.clientX,
                y: e.clientY
            };
            pan();
        }).on("mouseleave", function () {
            pz.pan.mousedown = false;
        });
        self.on(mousewheel, zoom);
    }

    SVG.extend(SVG.Element, {
        panZoom: panZoom
    });
}).call(this);
