var size = 0;
var placement = 'point';


var createTextStyle = function(feature, resolution, labelText, labelFont,
                               labelFill, placement, bufferColor,
                               bufferWidth) {

    if (feature.hide || !labelText) {
        return; 
    } 
    var bufferStyle = null;
    if (bufferWidth == 0) {
        bufferStyle = null;
    } else {
        bufferStyle = new ol.style.Stroke({
            color: bufferColor,
            width: bufferWidth
        });
    }
    
    var textStyle = new ol.style.Text({
        font: labelFont,
        text: labelText,
        textBaseline: "top",
        textAlign: "center",
        // offsetX: 8,
        offsetY: 10,
        placement: placement,
        maxAngle: 0,
        fill: new ol.style.Fill({
          color: labelFill
        }),
        stroke: bufferStyle
    });

    return textStyle;
};

function stripe(stripeWidth, gapWidth, angle, color) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = screen.width;
    canvas.height = stripeWidth + gapWidth;
    context.fillStyle = color;
    context.lineWidth = stripeWidth;
    context.fillRect(0, 0, canvas.width, stripeWidth);
    innerPattern = context.createPattern(canvas, 'repeat');

    var outerCanvas = document.createElement('canvas');
    var outerContext = outerCanvas.getContext('2d');
    outerCanvas.width = screen.width;
    outerCanvas.height = screen.height;
    outerContext.rotate((Math.PI / 180) * angle);
    outerContext.translate(-(screen.width/2), -(screen.height/2));
    outerContext.fillStyle = innerPattern;
    outerContext.fillRect(0,0,screen.width,screen.height);

    return outerContext.createPattern(outerCanvas, 'no-repeat');
}

function categories_ITGC_projects(feature, value, size, resolution, labelText,
   labelFont, labelFill, bufferColor, bufferWidth,
   placement) {
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

var geojsonStyleFunction = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    var value = feature.get("id");
    var labelText = "";
    var clusteredFeatures = feature.get("features");
    var labelFont = "11px \'Arial\', sans-serif";
    var labelFill = "rgba(0, 0, 0, 1)";
    var bufferColor = "#000000";
    var bufferWidth = 0.5;
    size = 1;
    var textAlign = "center";
    var offsetX = 0;
    var offsetY = 0;
    if (size == 1) {
        textAlign = "left";
        offsetX = 8;
        offsetY = 3;
        //var feature = clusteredFeatures[0];
        if (feature.get("project") !== null) {
            labelText = String(feature.get("project"));
        }
        key = value + "_" + labelText;
    } else {
        labelText = size.toString();
        size = 2*(Math.log(size)/ Math.log(2));
    }

    var style = categories_ITGC_projects(feature, value, size, resolution, labelText,
      labelFont, labelFill, bufferColor,
      bufferWidth, placement);

    return style;
};
