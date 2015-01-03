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
            var diffX = (pz.pan.fPos.x - pz.pan.iPos.x) / (tr.scaleX + 1);
            var diffY = (pz.pan.fPos.y - pz.pan.iPos.y) / (tr.scaleY + 1);
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

        var EventListeners = {
            mouse_down: function (e) {
                pz.pan.mousedown = true;
                pz.pan.iPos = {
                    x: e.clientX || e.touches[0].pageX,
                    y: e.clientY || e.touches[0].pageY
                };
            },
            mouse_up: function (e) {
                pz.pan.mousedown = false;
                pz.pan.fPos = {
                    x: e.clientX || e.touches[0].pageX,
                    y: e.clientY || e.touches[0].pageY
                };
                pan();
            },
            mouse_move: function (e) {
                pz.pan.fPos = {
                    x: e.clientX || e.touches[0].pageX,
                    y: e.clientY || e.touches[0].pageY
                };
                pan();
            },
            mouse_leave: function (e) {
                pz.pan.mousedown = false;
            }
        };

        rect
          .on(mousewheel, zoom)
          .on("mousedown", EventListeners.mouse_down)
          .on("touchstart", EventListeners.mouse_down)
          .on("mousemove", EventListeners.mouse_move)
          .on("touchmove", EventListeners.mouse_move)
          .on("mouseup", EventListeners.mouse_up)
          .on("touchup", EventListeners.mouse_up)
          .on("mouseleave", EventListeners.mouse_leave)
          ;

        self.on(mousewheel, zoom);
    }

    SVG.extend(SVG.Element, {
        panZoom: panZoom
    });
}).call(this);
