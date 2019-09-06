var size = 0;
var placement = 'point';

var styleFunctionSurface = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = "";
    var labelText = "";
    size = 0;
    var labelFont = "10px, sans-serif";
    var labelFill = "rgba(0, 0, 0, 1)";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 8;
    var offsetY = 3;
    var placement = 'point';
    if ("" !== null) {
        labelText = String("");
    }
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(250,0,0,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 5}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];

    return style;
};
