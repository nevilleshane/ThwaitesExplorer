var size = 0;
var placement = 'point';
function categories_Larter_paleo_groundinglines(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, offsetX, offsetY, textBaseline, bufferWidth,
                       placement, textAlign) {
                switch(value.toString()) {case '10 ka':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(140,140,140,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 3}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, textAlign)
    })];
                    break;
case '15 ka':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(220,220,220,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 3}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, textAlign)
    })];
                    break;
case '20 ka':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(255,255,255,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 3}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, textAlign)
    })];
                    break;
case '5 ka':
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(70,70,70,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 3}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, textAlign)
    })];
                    break;
default:
                    return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(5,5,5,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 2}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, textAlign)
    })];
                    break;}};

var style_Larter_paleo_groundinglines = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = feature.get("layer");
    var labelText = "";

    var labelFont = "12px \'Arial\', sans-serif";

    var labelFill = "rgba(255, 255, 255, 1)";
    var bufferColor = "#000000";
    var bufferWidth = 2;

    if (feature.get("displayLabel") && feature.get("layer") !== null) {
        labelText = String(feature.get("layer"));
    }
    
    if (isMobile) {
      labelFont = "8px \'Arial\', sans-serif";
      size = -1;
    }

    var placement = 'line';
    var offsetX = 0;
    var offsetY = 0;
    var textBaseline = "middle";
    var textAlign = "right";

    var style = categories_Larter_paleo_groundinglines(feature, value, size, resolution, labelText,
                              labelFont, labelFill, bufferColor, offsetX, offsetY, textBaseline,
                              bufferWidth, placement, textAlign);

    return style;
};
