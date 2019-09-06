var size = 0;
var placement = 'point';
$(document).ready(function() {

  //load up the geojson files and add outline and project layers
  $.get({
    url: 'data/Thwaites_surfacecatchment/Thwaites_surfacecatchment.geojson',
    dataType: "json",
    success: function(response) {
      data = response;

      var surfaceLayer = new ol.layer.Vector({
        visible:true,
        source: new ol.source.Vector({
          features: (new ol.format.GeoJSON()).readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection:'EPSG:3031'}),
        }),
        style: styleFunctionOutline,
        title: 'Thwaites Surface Catchment',
        projection: params.projection
      });

      alwaysOnLayers.add(surfaceLayer);
        
      map.addLayer(surfaceLayer);
    },
    error: function(xhr,status,error) {
      console.log(status);
      console.log(error);
    }
  })
  .then(function(res) {
    $.get({
      url: 'data/antarctic_coastS10RS/Antarctic_coastS10polyRS.geojson',
      dataType: "json",
      success: function(response) {
        data = response;

        var coastLayer = new ol.layer.Vector({
          visible:true,
          source: new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection:'EPSG:3031'}),
          }),
          style: styleFunctionOutline,
          title: 'Antarctic Coast',
          projection: params.projection
        });

        alwaysOnLayers.add(coastLayer);
          
        map.addLayer(coastLayer);
      },
      error: function(xhr,status,error) {
        console.log(status);
        console.log(error);
      }
    })
    .then(function(res) {
      $.get({
        url: 'data/ITGCprojects/layers/ITGC_projects_multipoint.geojson',
        dataType: "json",
        success: function(response) {
          data = response;

          var projectsLayer = new ol.layer.Vector({
            visible:true,
            source: new ol.source.Vector({
              features: (new ol.format.GeoJSON()).readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection:'EPSG:3031'}),
            }),
            style: styleFunctionProjects,
            title: 'ITGC Projects',
            projection: params.projection
          });

          alwaysOnLayers.add(projectsLayer);
             
          map.addLayer(projectsLayer);
        },
        error: function(xhr,status,error) {
          console.log(status);
          console.log(error);
        }
      });
    });
  });

});


// text style function for geojson layers
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

var styleFunctionOutline = function(feature, resolution){
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
    var color = 'rgba(35,35,35,1.0)';
    if (feature.get('stroke_color')) color = feature.get('stroke_color');
    var width = 0;
    if (feature.get('stroke_width')) width = feature.get('stroke_width');
    if ("" !== null) {
        labelText = String("");
    }
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: color, lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: width}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];

    return style;
};



