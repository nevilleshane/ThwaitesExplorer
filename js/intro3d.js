 require([
  "esri/Map",
  "esri/views/SceneView", 
  "esri/Graphic"
  ], function(Map, SceneView, Graphic) {

    var map = new Map({
      basemap: "satellite",
        ground: "world-elevation"  // show elevation
      });

    var view = new SceneView({
      container: "viewDiv",
      map: map,
      constraints: {
       rotationEnabled: false
     },
     camera: {
          position: {  // observation point
            x: -60,
            y: 31,
            z: 25000000 // altitude in meters
          },
          tilt: 0  // perspective in degrees
        }
      });
    var thwaites = {
      type: "point",
      longitude: -106.75,
      latitude: -75.5
    };

    var thwaitesText = {
      type: "point",
      longitude: -111,
      latitude: -75.8
    };

    var simpleMarkerSymbol = {
      type: "simple-marker",
      color: [0, 77, 168], 
      outline: {
          color: [255, 255, 255], // white
          width: 1
        }
      };

      var pictureMarker = {
        type: "picture-marker",
        url: "img/location-marker.png",
        width: 50,
      };

      var textSymbol= {
        type: "text", 
        text: "Thwaites",  
        font: { size: 25, weight: "bold", family: "arial" },
        verticalAlignment: "bottom",
        color: [0, 77, 168, 1],
      };

      var textGraphic = new Graphic({
        geometry: thwaitesText,
        symbol: textSymbol
      });
      var pointGraphic = new Graphic({
        geometry: thwaites,
        symbol: pictureMarker
      });

      view.graphics.add(pointGraphic);
      view.graphics.add(textGraphic);

      view.goTo({
        center: [-106.75,-75.5],
        zoom:4,
        heading:106
      }, {
        animate: true,
        speedFactor:0.1
      });



    });


 function startThwaitesExplorer() {
  $("#viewDiv").fadeOut(1000);
  $("#start_btn").hide();
  $(".map-div").css('opacity',1);
  // $("#menu").hide();
}