var size = 0;
var placement = 'point';

function categories_ITGC_projects(feature, value, size, resolution, labelText,
   labelFont, labelFill, bufferColor, bufferWidth,
   placement) {
    if (!value) return; 
    switch(value.toString()) {default:
        return [ new ol.style.Style({
            image: new ol.style.Circle({radius: 6.0 + size,
                stroke: new ol.style.Stroke({color: 'rgba(220,40,0,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 3}), fill: new ol.style.Fill({color: 'rgba(213,87,75,1.0)'})}),
            text: createTextStyle(feature, resolution, labelText, labelFont,
              labelFill, placement, bufferColor,
              bufferWidth)
        })];
        case '1':
        return [ new ol.style.Style({
            image: new ol.style.Circle({radius: 6.0 + size,
                stroke: new ol.style.Stroke({color: 'rgba(220,40,0,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 3}), fill: new ol.style.Fill({color: 'rgba(220,40,0,1.0)'})}),
            text: createTextStyle(feature, resolution, labelText, labelFont,
              labelFill, placement, bufferColor,
              bufferWidth)
        })];
        case '2':
        return [ new ol.style.Style({
            image: new ol.style.Circle({radius: 6.0 + size,
                stroke: new ol.style.Stroke({color: 'rgba(220,40,0,1.0)', lineDash: null, lineCap: 'butt', lineJoin: 'miter', width: 3}), fill: new ol.style.Fill({color: 'rgba(220,40,0,0.0)'})}),
            text: createTextStyle(feature, resolution, labelText, labelFont,
              labelFill, placement, bufferColor,
              bufferWidth)
        })];
    }
}

var styleFunctionProjects = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = feature.get("id");
    var labelText = "";
    var clusteredFeatures = feature.get("features");
    var labelFont = "11px \'Arial\', sans-serif";
    size = 1;
    var labelFill = "rgba(255, 255, 255, 1)";
    var bufferColor = "#000000";
    var bufferWidth = 1.5;
    var textAlign = "center";
    var offsetX = 0;
    var offsetY = 0;
    if (size == 1) {
        if (feature.get("project") !== null) {
            labelText = String(feature.get("project"));
        }
        key = value + "_" + labelText;
    } else {
        labelText = size.toString();
        size = 2*(Math.log(size)/ Math.log(2));
    }
    if (isMobile) {
      labelFont = "8px \'Arial\', sans-serif";
      size = -1;
    }
    var style = categories_ITGC_projects(feature, value, size, resolution, labelText,
      labelFont, labelFill, bufferColor,
      bufferWidth, placement);

    return style;
};
