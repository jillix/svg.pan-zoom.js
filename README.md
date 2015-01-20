svg.pan-zoom.js
===============
A JavaScript library for panning and zooming SVG things.

[![](http://i.imgur.com/R5TRDGU.png)](http://jillix.github.io/svg.pan-zoom.js/)

## Usage
This library depends on the [SVG.js](https://github.com/wout/svg.js) library.

```html
<script src="path/to/svg.js"></script>
<script src="path/to/svg.pan-zoom.js"></script>
<script>
    var svg = new SVG($(".graph").get(0)).size("100%", 900);
    var links = svg.group();
    var markers = svg.group();
    var nodes = svg.group();

    // Add draggable circles
    var g1 = nodes.group().translate(300, 200).draggable();
    g1.circle(80).fill("#C2185B");

    var g2 = nodes.group().translate(100, 200).draggable();
    g2.circle(50).fill("#E91E63");

    var g3 = nodes.group().translate(200, 400).draggable();
    g3.circle(100).fill("#FF5252");

    // Make the group pannable and zoomable
    nodes.panZoom();
</script>
```

Check out [the online demo](http://jillix.github.io/svg.pan-zoom.js/).

## Documentation
### `panZoom(opt_options)`
The pan-zoom contructor.

#### Params
- **Object** `opt_options`: An optional object containing the following fields:
 - `zoom` (Array): An array of two float values: the minimum and maximum zoom values (default: `undefined`).

#### Return
- **PanZoom** The PanZoom object containing the following fields:
 - `elm` (SVG): The selected element.
 - `pan` (Object): An object containing pan values.
 - `transform` (Object): An object containing the transform data (`scaleX`, `scaleY`, `x` and `y`).

## How to contribute
1. File an issue in the repository, using the bug tracker, describing the
   contribution you'd like to make. This will help us to get you started on the
   right foot.
2. Fork the project in your account and create a new branch:
   `your-great-feature`.
3. Commit your changes in that branch.
4. Open a pull request, and reference the initial issue in the pull request
   message.

## License
See the [LICENSE](./LICENSE) file.
