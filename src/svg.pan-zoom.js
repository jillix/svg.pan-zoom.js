/*!
 * SVG.js Pan Zoom Plugin
 * ======================
 *
 * A JavaScript library for pan and zoom SVG things.
 * Created with <3 and JavaScript by the jillix developers.
 *
 * svg.pan-zoom.js 1.0.0
 * Licensed under the MIT license.
 * */
;(function() {

    var container = null;
    var markers = null;

    var mousewheel = "onwheel" in document.createElement("div") ? "wheel" :
            document.onmousewheel !== undefined ? "mousewheel" :
            "DOMMouseScroll";

    /**
     * panZoom
     * The pan-zoom contructor.
     *
     * @name panZoom
     * @function
     * @param {Object|undefined} opt_options An optional object containing the following fields:
     *
     *  - `zoom` (Array): An array of two float values: the minimum and maximum zoom values (default: `undefined`).
     *
     * @return {PanZoom} The PanZoom object containing the following fields:
     *
     *  - `elm` (SVG): The selected element.
     *  - `pan` (Object): An object containing pan values.
     *  - `transform` (Object): An object containing the transform data (`scaleX`, `scaleY`, `x` and `y`).
     *
     */
    function panZoom(opt_options) {

        // Selected element
        var self = this;

        // Pan zoom object
        var pz = {
            pan: {},
            elm = self
        };

        // Set options
        opt_options = Object(opt_options);
        opt_options.zoom = opt_options.zoom || [];

        // Get the svg document
        var svg = self;
        while ((svg = self.parent).node.tagName.toUpperCase() !== "SVG") {}

        // Create the rectangle
        var rect = new SVG(document.createDocumentFragment()).rect().attr({
            width: svg.width(),
            height: svg.height(),
            fill: "none"
        }).style("pointer-events", "all");

        // Insert the rectangle
        self.parent.node.insertBefore(rect.node, self.node)

        /**
         * updateMatrix
         * An internal function called to update the svg matrix.
         *
         * @name updateMatrix
         * @function
         * @return {undefined}
         */
        function updateMatrix() {
            self.matrix([
                pz.transform.scaleX, 0, 0,
                pz.transform.scaleY, pz.transform.x, pz.transform.y
            ].join(","));
        }

        /**
         * pan
         * The internal function called for panning.
         *
         * @name pan
         * @function
         * @param {Event} e The internal listener event.
         * @return {undefined}
         */
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

        /*!
         * zoom
         * The internal function called for zooming.
         *
         * @name zoom
         * @function
         * @param {Event} e The internal listener event.
         * @return {undefined}
         */
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

            if (scale > opt_options.zoom[1]) {
                scale = opt_options.zoom[1];
                return;
            }

            if (scale < opt_options.zoom[0]) {
                scale = opt_options.zoom[0];
                return;
            }

            tr.scaleY = tr.scaleX = scale;
            tr.x = x;
            tr.y = y;

            self.node.dispatchEvent(new CustomEvent("zoom", e, tr));
            updateMatrix();
        }

        // The event listeners
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

        // Add event listeners
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

    // Extend the SVG.Element with the new function
    SVG.extend(SVG.Element, {
        panZoom: panZoom
    });
}).call(this);
