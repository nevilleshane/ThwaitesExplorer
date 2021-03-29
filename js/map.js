function MapClient(view, params) { 
  //global URLs
  gmrtUrl = "https://www.gmrt.org:443/services/PointServer";
  gmrtMapUrl = "https://www.gmrt.org/services/mapserver/";
  placeNamesUrl = "https://d1ubeg96lo3skd.cloudfront.net/data/overlays/WorldWFS";

  //load up the GMRT base layer
  gmrtLayer = new ol.layer.Tile({
    // type: 'base',
    basemap: true,
    visible: true,
    title: "GMRT Synthesis",
    source: new ol.source.TileWMS({
        url: gmrtMapUrl + params.url_ext,
        crossOrigin: 'anonymous',
        wrapX: true,
        params: {
          layers: params.layer,
        }
    })
  });

  //set up the map
  var map = new ol.Map({
    interactions: ol.interaction.defaults().extend([
          new ol.interaction.DragRotateAndZoom()
    ]),
    target: view
  });
  this.map = map;

  mobileZoomAdjust = 0;
  if (isMobile) {
    mobileZoomAdjust = 0.5;
    $("#close_btn").text("Cancel");
  }

  //set the map view
  map.setView(new ol.View({
    center: params.center,
    zoom: params.zoom - mobileZoomAdjust,
    minZoom: 2,
    projection: params.projection,
    extent: params.view_extent,
    enableRotation: false,
  }));

 // don't need for hidden_map
  if (view == 'map') {
    ibcso = new ol.layer.Tile({
      type: 'base',
      basemap: true,
      title: "IBCSO",
      visible: true,
      source: new ol.source.TileArcGISRest({
          url:"https://gis.ngdc.noaa.gov/arcgis/rest/services/antarctic/antarctic_basemap/MapServer",
          crossOrigin: 'anonymous',
          params: {
          transparent: true
        }
      })
    });

    terra = new ol.layer.Tile({
      type: 'base',
      basemap: true,
      title: "15m TerraColor",
      visible: false,
      source: new ol.source.TileArcGISRest({
          url:"https://services.arcgisonline.com/arcgis/rest/services/Polar/Antarctic_Imagery/MapServer",
          crossOrigin: 'anonymous',
          params: {
          layers: "Antarctic_Imagery",
          transparent: true
        }
      })
    });

    lima = new ol.layer.Tile({
      type: 'base',
      title: "LIMA 240m",
      basemap: true,
      visible: false,
      source: new ol.source.TileWMS({
          url:"https://api.usap-dc.org:8443/wfs?",
          // crossOrigin: 'anonymous',
          params: {
          layers: "LIMA 240m",
          transparent: true
          }
      })
    });


    var mapMinZoom = 0;
    var mapMaxZoom = 6;
    var mapMaxResolution = 374.99999949;
    var tileExtent = [-3174449.99580000, -2816674.99630659, 2867549.99599430, 2406324.99660000];
    var mapResolutions = [];
    for (var z = 0; z <= mapMaxZoom; z++) {
      mapResolutions.push(Math.pow(2, mapMaxZoom - z) * mapMaxResolution);
    }
    var mapTileGrid = new ol.tilegrid.TileGrid({
      extent: tileExtent,
      minZoom: mapMinZoom,
      resolutions: mapResolutions
    });
    modis_moa = new ol.layer.Tile({
      type: 'base',
      title: "MODIS MOA",
      basemap: true,
      visible: false,
      source: new ol.source.XYZ({
        projection: 'EPSG:3031',
        tileGrid: mapTileGrid,
        tilePixelRatio: 1.00000000,
        url: "data/MODISMOA/MOA2014_hp1_750m_zoom6/{z}/{x}/{y}.png",
      })
    });


    map.addLayer(gmrtLayer);
    if (params.projection == sp_proj) {
      map.addLayer(terra);
      map.addLayer(ibcso);
      map.addLayer(lima);
      map.addLayer(modis_moa);
    }
  
    //add the scale line
    var scaleline = new ol.control.ScaleLine({target:"scaleline"});
    map.addControl(scaleline);

    //add layer switcher
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende'
    });
    map.addControl(layerSwitcher);

    // add overview map
    overviewMapControl = new ol.control.OverviewMap({
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: map.getLayers(),
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: false, 
      view: new ol.View({
        center: params.overview_center,
        projection: params.projection,
        extent: params.view_extent,
      })
    });

    map.addControl(overviewMapControl);
  }


  return map;
}


mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};


$(document).ready(function() {
  isMobile = mobilecheck();
  //set up projections
  //SP
  proj4.defs('EPSG:3031', '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
  //NP
  proj4.defs('EPSG:3995', '+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');

  sp_proj = ol.proj.get('EPSG:3031');
  sp_proj.setWorldExtent([-180.0000, -90.0000, 180.0000, -60.0000]);
  sp_proj.setExtent([-8200000, -8200000, 8200000, 8200000]);
  sp_center = ol.proj.transform([-180,0], 'EPSG:4326', 'EPSG:3031');
  thwaitesCoords = ol.proj.transform([-106.75,-75.5], 'EPSG:4326', 'EPSG:3031');
  np_proj = ol.proj.get('EPSG:3995');
  np_proj.setWorldExtent([-180.0000, 60.0000, 180.0000, 90.0000]);
  np_proj.setExtent([-8200000, -8200000, 8200000, 8200000]);
  merc_proj = ol.proj.get('EPSG:3857');
  //view extents used to stop map from panning off of screen
  merc_view_extent = [-Number.MAX_VALUE, -20037508.342789244, Number.MAX_VALUE, 20037508.342789244];
  np_view_extent = [-8200000, -8200000, 8200000, 8200000];
  sp_view_extent = [-8200000, -8200000, 8200000, 8200000];
  //parameters for different GMRT projections
  gmrt_params = {
    "merc": {"url_ext": "wms_merc?", "projection": merc_proj, "layer": "topo", "zoom": 2, "view_extent": merc_view_extent, 
             "center": [0,0], "overview_center": [0,0], "proj_code":0},
    "sp": {"url_ext": "wms_SP?", "projection": sp_proj, "layer": "GMRT_SP", "zoom": 4.7, "view_extent": sp_view_extent, 
           "center": thwaitesCoords, "overview_center": sp_center, "proj_code":1},
    "np": {"url_ext": "wms_NP?", "projection": np_proj, "layer": "GMRT_NP", "zoom": 2, "view_extent": np_view_extent,
          "center": [0,0], "overview_center": [0,0], "proj_code":2}
  };

  //initialize the main map in Mercator projection
  params = gmrt_params.sp;
  map = new MapClient('map', params);



  //add a hidden map that only contains the top layer
  //this is what will be queried when clicking on the map
  map2 = new MapClient('hidden_map', params);


  /*
    Elements that make up the popup.
  */
  container = document.getElementById('table-popup');
  content_element = document.getElementById('table-popup-content');
  closer = document.getElementById('table-popup-closer');

  /*
    Create an overlay to anchor the popup to the map.
  */
  table_popup_overlay = new ol.Overlay({
    title: "tablePopupOverlay",
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  map.addOverlay(table_popup_overlay);

  /*
   Add a click handler to hide the popup.
  */
  closer.onclick = function() {
    table_popup_overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  /*
    handle the start of a map move/zoom
  */
  map.on('movestart', function(evt) {
    $("#elev").text("");
    $("#elev_triangle").hide();
  });

  /*
    handle the end of a map move/zoom
  */
  map.on('moveend', function(evt) {
    //reset the view center point
    constrainPan();
    //make sure hidden map stays aligned with visible map
    map2.getView().setZoom(map.getView().getZoom());
    map2.getView().setCenter(map.getView().getCenter());
    //console.log("zoom level: " + map.getView().getZoom() + "("+Math.pow(2,map.getView().getZoom()-1)+") " + map.getView().getResolution());
  });

  view = map.getView();
  view.on('change:center', constrainPan);

  /*
    Use the mouse position to display lat/lon
  */
  var mousePosition = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(2),
      projection: 'EPSG:4326',
      target: document.getElementById('mouseposition'),
      undefinedHTML: '&nbsp;'
  });
  map.addControl(mousePosition);

  // set up the geolocation api to track our position
  geolocation = new ol.Geolocation({
    projection: map.getView().getProjection()
  });

  // set the location feature as a blue circle 
  // var positionFeature = new ol.Feature();
  // positionFeature.setStyle(
  //   new ol.style.Style({
  //   image: new ol.style.Circle({
  //     radius: 6,
  //     fill: new ol.style.Fill({
  //       color: '#3399CC'
  //     }),
  //     stroke: new ol.style.Stroke({
  //       color: '#fff',
  //       width: 2
  //     })
  //   })
  // }));

  //get current location and set the coordinates of the location feature
  // geolocation.on('change:position', function() {
  //   var coords = geolocation.getPosition();
  //   //just use coords to 2dp, ie around 1 mile range
  //   coords = [coords[0].toFixed(2), coords[1].toFixed(2)];
  //   positionFeature.setGeometry(coords ?
  //     new ol.geom.Point(coords) : null);
  // });

  // //create a geolocation layer
  // geolocationLayer = new ol.layer.Vector({
  //   source: new ol.source.Vector({
  //     features: [positionFeature]
  //   })
  // });
});

/*
  This constrains the map to within the view by adjusting the center after a pan or zoom
*/
var constrainPan = function() {
    var extent = params.view_extent;
    // add an extra margin at the top if showing table popups so they don't get cut off
    if (table_popup_overlay.getPosition()) return;
    var extentHeight = extent[3] - extent[1];
    var extentWidth = extent[2] - extent[0];
    var visible = view.calculateExtent(map.getSize());
    var visibleHeight = visible[3] - visible[1];
    var visibleWidth = visible[2] - visible[0];
    var centre = view.getCenter();
    var delta;
    var adjust = false;
    if (visibleHeight > extentHeight) {
      // if the view is taller than the map extent (eg in full screen mode), fix the
      // vertical centre of the map to be 0 so it can't be moved up or down.
      adjust = true;
      centre[1] = 0;
    } else {
      if ((delta = extent[1] - visible[1]) > 0) {
          adjust = true;
          centre[1] += delta;
      } else if ((delta = extent[3] - visible[3]) < 0) {
          adjust = true;
          centre[1] += delta;
      }
    }
    if (visibleWidth > extentWidth) {
      // if the view is wider than the map extent (eg polar projection), fix the
      // horizontal centre of the map to be 0 so it can't be moved left or right.
      adjust = true;
      centre[0] = 0;
    } else {
      if ((delta = extent[0] - visible[0]) > 0) {
          adjust = true;
          centre[0] += delta;
      } else if ((delta = extent[2] - visible[2]) < 0) {
          adjust = true;
          centre[0] += delta;
      }
    }
    if (adjust) {
        view.setCenter(centre);
        map.updateSize();
    }

    updateDisplayParams({zoom:map.getView().getZoom(), center:map.getView().getCenter()})
};

/*
  Display a tile_512 (local) layer
*/
function displayTile512(overlay, removeOldLayers, sequence) {
  console.log(overlay);

  var delta = parseInt(overlay.tileDelta)/180;

  var projExtent = ol.proj.get('EPSG:4326').getExtent();
  var startResolution = ol.extent.getWidth(projExtent) / overlay.tileSize * delta;
  var resolutions = new Array(overlay.numLevels+1);
  for (var i = 0, ii = resolutions.length; i < ii; ++i) {
    resolutions[i] = startResolution / Math.pow(2, i);
  }
 
  tileGrid = new ol.tilegrid.TileGrid({
    minZoom: 1,
    maxZoom: overlay.numLevels,
    extent: projExtent,
    resolutions: resolutions,
    tileSize: [overlay.tileSize, overlay.tileSize]
  });

  function tileUrlFunction(tileCoord) {
    var new_z = tileCoord[0]-1;
    var url = urlTemplate.replace('{z}', new_z)
        .replace('{x}', tileCoord[1].toString())
        .replace(/{y}/g, (Math.pow(2, new_z)/delta + tileCoord[2]).toString());
    return url;
  }

  var urlTemplate = overlay.source + '/{z}/{y}/{y}_{x}.png' ; 
  var eoLayer = new ol.layer.Tile({
    source: new ol.source.TileImage({
      minZoom: 1,
      maxZoom: overlay.numLevels,
      projection: 'EPSG:4326',
      tileSize: overlay.tileSize,
      //tilePixelRatio:2,
      crossOrigin: 'anonymous',
      tileGrid: tileGrid,
      tileUrlFunction: tileUrlFunction,
      wrapX: true,
      transition:0
    }),
    title: sequence ? overlay.title + " " + overlay.label : overlay.title
  });
  displayLayer(eoLayer, overlay, removeOldLayers);
}


/*
  Display a tiled (local) layer
*/
function displayTiled(overlay, removeOldLayers, sequence) {
  console.log(overlay);

  var proj = overlay.mapProjection;
  switchProjection(proj, overlay);

  var mapResolutions = [];
  for (var z = 0; z <= overlay.mapMaxZoom; z++) {
    mapResolutions.push(Math.pow(2, overlay.mapMaxZoom - z) * overlay.mapMaxResolution);
  }

  var mapTileGrid = new ol.tilegrid.TileGrid({
    tileSize: [overlay.tileWidth, overlay.tileHeight],
    extent: overlay.extent,
    minZoom: 1,
    resolutions: mapResolutions
  });

  var layer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      projection: params.projection,
      tileGrid: mapTileGrid,
      tilePixelRatio: 1.00000000,
      url: overlay.source + "/{z}/{x}/{y}.png",
    }),
    title: sequence ? overlay.title + " " + overlay.label : overlay.title
  });
  displayLayer(layer, overlay, removeOldLayers);
}

/*
  display a WMS_512 layer
*/
function displayWMS512(overlay, removeOldLayers, sequence) {
  console.log(overlay);
  var url = overlay.source;
  var wmsLayer = new ol.layer.Tile({
    type: 'base',
    title: sequence ? overlay.title + " " + overlay.label : overlay.title,
    source: new ol.source.TileWMS({
      url: url,
      crossOrigin: 'anonymous',
      projection: getProjectionFromUrl(url),
      params: getParamsFromUrl(url)
    }),
  });
  displayLayer(wmsLayer, overlay, removeOldLayers);
}

/*
  get the projection from the WMS URL
*/
function getProjectionFromUrl(url) {
  return getParamFromUrl(url, "SRS");
}

/*
  get parameter values from WMS URL
*/
function getParamsFromUrl(url) {
  var params={
    LAYERS: getParamFromUrl(url, "layers"),
    STYLES: getParamFromUrl(url, "styles"),
    VERSION: getParamFromUrl(url, "version"),
    WIDTH: getParamFromUrl(url, "width"),
    HEIGHT: getParamFromUrl(url, "height"),
    BBOX: getParamFromUrl(url, "bbox"),
    CRS: getParamFromUrl(url, "crs"),
    SRS: getParamFromUrl(url, "srs")
  };
  return params;
}

/*
  extract a parameter value from a WMS URL
*/
function getParamFromUrl(url, param) {
  url = url.toUpperCase();
  param = param.toUpperCase();
  if (url.indexOf(param) > 0) {
    var value = url.split(param+"=")[1];
    value = value.split("&")[0];
    return value;
  }
  return null;
}

/*
  merge two javascript objects - used to copy parameters from a multilayer object 
  to it's child layers
*/
function mergeObjects(obj1,obj2){
    var obj3 = {'parent_type': obj1.type};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

/*
  update the parametsers displayed in the URL in the browser
*/
function updateDisplayParams(update, remove=false) {
  if (remove) {
    delete display_params[update];
    delete url_params[update];
  } else {
   Object.assign(display_params, update);
  }
  window.history.pushState({},'Title','?' + object_to_query_string(display_params));
}


/*
  display an Overlay_sequence
*/
function displayOverlaySequence(overlay, removeOldLayers) {
  console.log(overlay);
  var type = overlay.overlayType;
  console.log(type);

  //get the overlay sequence
  $.ajax({
    type: "GET",
    url: overlay.sequenceSource,
    crossOrigin: true,
    success: function(response) {
      var lines = response.split("\n");
      sequences = [];
      for (var i in lines) {
        var line = lines[i].split("\t");
        if (line[0] === "") continue;
        var seq = {"label": line[0], "source": line[1]};
        //combine the sequence object with the overlay object
        //so that we retain all information
        sequences.push(mergeObjects(seq, overlay));
      }

      seq_num = url_params.seq_num || 0;
     
      if (overlay.cycleSequence) {
         $("#sequence_left").removeClass("disabled");
         $("#sequence_right").removeClass("disabled");
      }
      else {
        if (seq_num == 0) 
          $("#sequence_left").addClass("disabled");
        else
          $("#sequence_left").removeClass("disabled");
        if (sequences.length == 1 || (seq_num == sequences.length - 1 && !overlay.cycleSequence)) 
          $("#sequence_right").addClass("disabled");
        else
          $("#sequence_right").removeClass("disabled");
      }

      $("#sequence_level").text(sequences[seq_num].label);
      $("#sequence").show();
      updateDisplayParams({seq_num:seq_num});
      displaySequenceLayer(sequences[seq_num], type, true);
    }
  });

  
  // set the sequence left and right buttons to move through the sequences
  $("#sequence_left").unbind('click').click(function() {
    if ($("#sequence_left").hasClass("disabled")) return;
    seq_num--;
    if (overlay.cycleSequence) {
      // cycle to the end of the sequence
      if (seq_num < 0) seq_num = sequences.length - 1;
    }
    else {
      if (seq_num === 0) $("#sequence_left").addClass("disabled");
    }
    $("#sequence_level").text(sequences[seq_num].label);
    $("#sequence_right").removeClass("disabled");

    updateDisplayParams({seq_num:seq_num});
    displaySequenceLayer(sequences[seq_num], type, false); 
  });

  $("#sequence_right").unbind('click').click(function() {
    if ($("#sequence_right").hasClass("disabled")) return;
    seq_num++;
    if (overlay.cycleSequence) {
      // cycle to the start of the sequence
      if (seq_num === sequences.length) seq_num = 0;
    }
    else {
      if (seq_num === sequences.length - 1) $("#sequence_right").addClass("disabled");
    }
    $("#sequence_level").text(sequences[seq_num].label);
    $("#sequence_left").removeClass("disabled");

    updateDisplayParams({seq_num:seq_num});
    displaySequenceLayer(sequences[seq_num], type, false);
  });

  /*
    direct the layer to the appropriate display function
  */
  function displaySequenceLayer(layer, type, removeOldLayers) {
    var sequence = true;
    //remove any existing sequence layers
    // removeLayerByName("Sequence");
    switch(type) {
      case "arcgis_tile_256":
        displayArcGIS(layer, removeOldLayers, sequence);
        break;
      case "tile_512":
        displayTile512(layer, removeOldLayers, sequence);
        break;
      case "tiled":
        displayTiled(overlay, removeOldLayers, sequence);
        break;
      case "wms_512":
        displayWMS512(layer, removeOldLayers, sequence);
        break;
      case "NOAAtile_256":
        displayNOAA(layer, removeOldLayers, sequence);
        break;
      case "table":
        displayTable(layer, removeOldLayers, sequence);
        break;
      case "geojson":
        displayGeojson(layer, removeOldLayers, sequence);
        break;
      case "overlay_sequence":
        displayOverlaySequence(layer, removeOldLayers);
        break;
      case "xb_map":
        displayXBMap(layer, removeOldLayers, sequence);
        break;
      case "geojson":
        displayGeojson(layer, removeOldLayers);
        break;
      case "image":
        displayImage(layer, removeOldLayers, sequence);
        break;
      default:
        console.log("Unknown Sequence Layer Type: " + type);
    }
  }
}

/*
  display NOAA layer
*/
function displayNOAA(overlay, removeOldLayers, sequence) {
  console.log(overlay);

  //since we can't access the requestSourcePath directly to get the latest source path
  //due to Cross Origin restraints, a python script is run daily using cron that will
  //fetch those paths and save them in the noaaSourcePaths.json file. 
  if (overlay.requestSourcePath && overlay.source) {

    //First need to work out the product name to get the latest source path.
    var split = overlay.source.split("/");
    imageName = split[6];
    parts = imageName.split(".");
    product = parts[0] + "." + parts[1];

    $.ajax({
      url: "js/noaaSourcePaths.json",
      dataType: "json",
    }).done(function(data) { 
        tileUrl = data[product];
        getLayer(tileUrl);
    }).fail(function(err) {
      console.log("ERROR");
      console.log(err);
    });
  }

  //for sequences, use the source path sent to the function
  if (overlay.sequenceSource) {
    getLayer(overlay.source);
  }

  function getUrlAndImageName(tileUrl) {
    var split = tileUrl.split("/");
    var imageName = split[6];
    var split2 = imageName.split(".");
    var productName = split2[0] + "_" + split2[1];
    // for, e.g. salinity layer:
    if (split2[3] != "color") {
      productName += "_" + split2[3] + "m";
    }
    url = "https://gis.nnvl.noaa.gov/arcgis/rest/services/" + split[5] + "/" + productName + "/ImageServer/";
    return {url: url, imageName: imageName};
  }

  function getLayer(tileUrl) {
    var urlAndImageName = getUrlAndImageName(tileUrl);
    console.log(urlAndImageName);
    var arcgisLayer = new ol.layer.Tile({
      source: new ol.source.TileArcGISRest({
        url: urlAndImageName.url,
        crossOrigin: "anonymous",
        wrapX: true,
        params: {
          mosaicRule: "{where:\"name = '" + urlAndImageName.imageName + "'\"}"
        }
      }),
      title: sequence ? overlay.title + " " + overlay.label : overlay.title
    });
    displayLayer(arcgisLayer, overlay, removeOldLayers);
  }
}


/*
  display ArcGIS layer
*/
function displayArcGIS(overlay, removeOldLayers, sequence) {
  console.log(overlay);
  var arcgisLayer;
  arcgisLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: overlay.source + "{z}/{y}/{x}",
      crossOrigin: "anonymous"
    }),
    title: sequence ? overlay.title + " " + overlay.label : overlay.title
  });
  displayLayer(arcgisLayer, overlay, removeOldLayers);
}


/*
  display static Image layer
*/
function displayImage(overlay, removeOldLayers, sequence) {
  console.log(overlay);
  var imageLayer;
  imageLayer = new ol.layer.Image({
    opacity: 1,
    title: sequence ? overlay.title + " " + overlay.label : overlay.title,              
    source: new ol.source.ImageStatic({
      url: overlay.source,
      imageExtent: overlay.extent
    })
  });

  displayLayer(imageLayer, overlay, removeOldLayers);
}


/*
  display xb_map (local polar projected layers)
*/
function displayXBMap(overlay, removeOldLayers, sequence) {
  console.log(overlay);

  //switch projection
  var proj = overlay.mapProjection;
  switchProjection(proj, overlay);

  //calculate the resolutions for each zoom level
  var projExtent = map.getView().getProjection().getExtent();
  if (overlay.extent) projExtent = overlay.extent;
  var startResolution = ol.extent.getWidth(projExtent) / 320;
  var resolutions = new Array(overlay.numLevels+1);
  for (var i = 0, ii = resolutions.length; i < ii; ++i) {
    resolutions[i] = startResolution / Math.pow(2, i);
  } 

  // This resets the view to Thwaites - don't think we need it
  // map.setView(new ol.View({
  //   center: params.center,
  //   zoom: params.zoom - mobileZoomAdjust,
  //   minZoom: 2,
  //   projection: params.projection,
  //   extent: params.view_extent,
  //   enableRotation: false,
  // }));


  
  //set up a tile grid
  tileGrid = new ol.tilegrid.TileGrid({
    minZoom: 1,
    maxZoom: overlay.numLevels,
    extent: projExtent,
    resolutions: resolutions,
    tileSize: [320,320]
  });

  var source_url = overlay.source.replace("http://www.earth-observer", "https://d1ubeg96lo3skd.cloudfront.net");
  //make sure there is not a / and the end of the source URL
  if (source_url.slice(-1) == "/") {
    source_url = source_url.slice(0, -1);
  }
  var xbMapUrlTemplate =  source_url + '/i_{res}/{name}.png'; 
  xbMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
      projection: map.getView().getProjection(),
      tileSize: 320,
      minZoom:1,
      maxZoom:overlay.numLevels,
      tileGrid: tileGrid,
      crossOrigin: 'anonymous',
      tileUrlFunction: function(tileCoord) {
        var url = xbMapUrlTemplate.replace('{res}', (Math.pow(2,tileCoord[0]-1)).toString())
            .replace('{name}', getNameWithTileX(tileCoord));
        return(url);
      },
      wrapX: false
    }),
    title: sequence ? overlay.title + " " + overlay.label : overlay.title
  });
  //use the tileCoords to geerate the URL name
  function getNameWithTileX(tileCoord) {
    var x = tileCoord[1];
    var y = tileCoord[2];
    var res = Math.pow(2,tileCoord[0]-1);

    var first;
    var second;
    if (res - x > 0)
      first = "W" + (res-x).toString();
    else
      first = "E" + (x-res).toString();

    if (res + y >= 0 )
      second = "S" + (res + 1 + y).toString();
    else
      second = "N" + (-1 * (res + 1 + y)).toString();

    var name = first + second + "_320";
    return name;
  }
  displayLayer(xbMapLayer, overlay, removeOldLayers);
}

/* 
  switch to a different projection
*/
function switchProjection(proj, overlay) {
  switch(proj) {
    case 0:
      params = gmrt_params.merc;
      break;
    case 1:
      params = gmrt_params.sp;
      break;
    case 2:
      params = gmrt_params.np;
      break;
  }

  if (map.getView().getProjection() == params.projection) return;
  map.getView().setZoom(params.zoom);
  map.removeLayer(gmrtLayer);

  var this_zoom = params.zoom;
  if (url_params.menu_id == overlay.menu_id)
    this_zoom = url_params.zoom;

  view = new ol.View({
    center: params.center,
    zoom: this_zoom,
    minZoom: 2,
    projection: params.projection,
    extent: params.view_extent,
    enableRotation: false
  });
  map.setView(view);
 
  gmrtLayer = new ol.layer.Tile({
    type: 'base',
    title: "GMRT Synthesis",
    source: new ol.source.TileWMS({
        url: gmrtMapUrl + params.url_ext,
        params: {
        layers: params.layer
        }, 
        crossOrigin: "Anonymous"
    })
  });

  if (proj == 0) {
    map.addLayer(gmrtLayer);
  }

  //replace the overview map
  var layers = [];
  if (proj == 1) {
    layers = map.getLayers(); 
  }
  else {
    layers = [gmrtLayer];
  }

  var layerGroup = new ol.layer.Group({
    layers: layers
  });

  overviewMapControl.getOverviewMap().set('view',
    new ol.View({
      center: params.overview_center,
      projection: params.projection,
      extent: params.view_extent,
    }));
  overviewMapControl.getOverviewMap().set('layergroup', layerGroup);

  map.getControls().forEach(function (control) {
    if (control instanceof ol.control.OverviewMap) {
      map.removeControl(control);
    }
  });

  map.addControl(overviewMapControl);

  //update projection of hidden map too
  map2.setView(view);
 
  //set listener of center change (ie panning)
  view.on('change:center', constrainPan);
}

/*
  handle multilayer displays, directing each layer to the correct display function
*/
function displayMultiLayers(overlay) {
  console.log(overlay);
  var removeOldLayers = true;
  for (var i in overlay.layers) {
    var layer = mergeObjects(overlay, overlay.layers[i]);
    //don't remove the lowest layer
    if (i > 0) removeOldLayers = false; 
    switch(layer.type) {
      case "arcgis_tile_256":
        displayArcGIS(layer, removeOldLayers);
        break;
      case "tile_512":
        displayTile512(layer, removeOldLayers);
        break;
      case "tiled":
        displayTiled(layer, removeOldLayers);
        break;      
      case "wms_512":
        displayWMS512(layer, removeOldLayers);
        break;
      case "NOAAtile_256":
        displayNOAA(layer, removeOldLayers);
        break;
      case "table":
        displayTable(layer, removeOldLayers);
        break;
      case "overlay_sequence":
        displayOverlaySequence(layer, removeOldLayers);
        break;
      case "xb_map":
        displayXBMap(layer, removeOldLayers);
        break;
      case "geojson":
        displayGeojson(layer, removeOldLayers);
        break;
      case "image":
        displayImage(layer, removeOldLayers, sequence);
        break;
      default:
        console.log("Unknown Overlay Type: " + layer.type);
    }

  }
}


/*
  display a geojson layer
*/
function displayGeojson(overlay, removeOldLayers) {
  console.log(overlay);

  //switch projection
  var proj = overlay.mapProjection;
  switchProjection(proj, overlay);
  
  //load up the geojson
  $.get({
    url: overlay.source,
    dataType: "json",
    crossOrigin: false,
    success: function(response) {
      var data = response;

      //load up the style function
      $.getScript(overlay.styleFunctionFile, function() {
        //make sure all other tables are cleared first
        removeAllTables();
        var geojsonLayer = new ol.layer.Vector({
          visible:true,
          source: new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(data, {dataProjection: 'EPSG:4326', featureProjection:'EPSG:3031'}),
          }),
          style: eval(overlay.styleFunction),
          title: overlay.title,
          projection: params.projection
        });

        displayLayer(geojsonLayer, overlay, removeOldLayers);
      });
    },
    error: function(xhr,status,error) {
      console.log(status);
      console.log(error);
    }
  });
}


/*
  display a table layer
*/
function displayTable(overlay, removeOldLayers) {
  console.log(overlay);
  var sizeCol, sizeRange, sizeColString, colorCol, colorColString;
  if (overlay.scaleSizeColumn) sizeCol = overlay.scaleSizeColumn-1;
  if (overlay.scaleSizeRange) {
    sizeRange = overlay.scaleSizeRange.split(",");
    sizeRange = [parseInt(sizeRange[0]), parseInt(sizeRange[1])];
  }
  if (overlay.symbolColorColumn) colorCol = overlay.symbolColorColumn-1;
  $.get({
    url: overlay.source,
    dataType: "text",
    crossOrigin: true,
    success: function(response) {
      var csvString = response;

      if (overlay.separator === "tsv") {
        //if tab-separated, convert to comma-separated (replace commas with pipes first)
        csvString = csvString.replace(/,/g, "|").replace(/\t/g, ",");
      }

      // get symbol size and color column names
      var columns = csvString.split(/\r?\n|\r/)[0].split(',');
      
      //go through the columns and if they do not all have unique names, add a #repeated_key# extension
      for (var i in columns) {
        var col = columns[i];
        if (columns.indexOf(col) != columns.lastIndexOf(col)) {
          columns[i] = col + "#repeated_key#";
          csvString = csvString.replace(col + ",", col + "#repeated_key#,");
        }
      }

      if (sizeCol) sizeColString = columns[sizeCol];
      if (colorCol) colorColString = columns[colorCol];
      csv2geojson.csv2geojson(csvString, {latfield: columns[overlay.latitudeColumn], lonfield: columns[overlay.longitudeColumn], delimeter: ','}, function(err, data) {
        //make sure all other tables are cleared first
        removeAllTables();
        tableLayer = new ol.layer.Vector({
          visible:true,
          source: new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(data, {featureProjection:'EPSG:3857'}),
          }),
           style: styleFunction,
           title: overlay.title
        });
        //set up Object for table popup display
        properties = [];
        units = overlay.listUnits.replace(/NULL/g, "").split(",");
        var list_order = overlay.listOrder.split(",");
        for (var i in list_order) {
          var ind = list_order[i] - 1;
          properties.push(columns[ind]);
        }

        var url;
        var url_property;
        if (overlay.clickableLink) {
          var link = overlay.clickableLink.split(","); 
          if (link.length > 1) {
            url = link[0];
            url_property = columns[link[1]-1];
          } else if (link.length === 1) {
            if (link.indexOf("http") > -1) url = link[0];
            else url_property = columns[link[0]-1];
          }
        }
        var image_url;
        var image_url_property;
        if (overlay.imageLink) {
          var image_link = overlay.imageLink.split(",");
          if (image_link.length > 1) {
            image_url = image_link[0];
            image_url_property = columns[image_link[1]-1];
          } else if (image_link.length === 1) {
            if (image_link.indexOf("http") > -1) image_url = image_link[0];
            else image_url_property = columns[image_link[0]-1];
          }
        }
        
        // used by tidal stations layer
        var image_text_keys = [];
        if (overlay.imageTextCols) {
          var image_text_cols = overlay.imageTextCols.split(",");
          for (var i in image_text_cols){
            var ind = image_text_cols[i] - 1;
            image_text_keys.push(columns[ind])
          }
        }

        tablePopupObj = {"layer": overlay.title,
                         "properties": properties, 
                         "units": units,
                         "list_order": list_order, 
                         "base_url": url,
                         "url_property": url_property,
                         "image_base_url": image_url,
                         "image_url_property": image_url_property,
                         "image_text_keys": image_text_keys};
        console.log(tablePopupObj);

        displayLayer(tableLayer, overlay, removeOldLayers);

      });
    }
  });

  // set the style function for the plotted points
  var styleFunction = function(feature) {
    var rgb = [0,0,0];
    if (colorColString && feature.get(colorColString)) {
      rgb = feature.get(colorColString).split('|');
    }
    var radius = 5;
    if (sizeColString && feature.get(sizeColString)) {
      radius = feature.get(sizeColString);
      // if (radius < sizeRange[0]) radius = sizeRange[0];
      // if (radius > sizeRange[1]) radius = sizeRange[1];
    }
    var retStyle = new ol.style.Style({
        image: new ol.style.Circle({
          radius: radius,
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 255, 255, 1)',
            width: 1
          }),
          fill: new ol.style.Fill({
            color: 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] +' , 1)'
          })
        })
      });
    return retStyle;
  };
}

/*
  convert a decimal color value to RGB
*/
function decimalToRGB(c) {
  var r = Math.floor(c / (256*256));
  var g = Math.floor(c / 256) % 256;
  var b = c % 256;
  return "rgb("+r+","+g+","+b+")";
}

/*
  Display place names from a JSON file created using the WFS XML pages
  This is simpler than handling gridded tiles
*/
function displayPlaceNameFeatures() {
  var formatGeoJSON = new ol.format.GeoJSON();

  sourceVector = new ol.source.Vector({
    loader: function() {
      for (var j in placeNameFeatures) {
        var placeNameFeature = placeNameFeatures[j];
        var feature = formatGeoJSON.readFeature(placeNameFeature.feature);
        feature.getGeometry().transform(merc_proj, map.getView().getProjection());
        feature.setStyle(textStyleFunction);
        feature.minZoom = placeNameFeature.minZoom;
        feature.maxZoom = placeNameFeature.maxZoom;
        feature.fontColor = decimalToRGB(placeNameFeature.fontColor);
        feature.fontSize = placeNameFeature.fontSize;
        feature.fontName = placeNameFeature.fontName;
        feature.name = placeNameFeature.name;
        sourceVector.addFeature(feature);
      }
    }
  });
 
  function textStyleFunction() {
    return [
      new ol.style.Style({
          fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new ol.style.Text({
          font: this.fontSize + 'px ' + this.fontName,
          fill: new ol.style.Fill({ color: this.fontColor }),
          stroke: new ol.style.Stroke({
            color: "#000", width: 1.5
          }),
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          text: (Math.pow(2,map.getView().getZoom()-1) >= this.minZoom && Math.pow(2,map.getView().getZoom()-1) <= this.maxZoom) ? this.name : ""
          //text: this.name
        })
      })
    ];
  }
  
  placeNamesLayer = new ol.layer.Vector({
    title: "placeNamesLayer",
    source: sourceVector,
    zIndex:10
  });
  map.addLayer(placeNamesLayer);
}

/* 
  This code loads up all the WFS XML files in one go and extracts the features, rather than using gridded tiles.  
  It is too slow to use on the actual webapp.
  Instead, it can be used to create json strings that can be copied from the console and 
  saved in placeNameFeatures.json.  It is best to run in small batches, rather than all at once as too many
  ajax processes can overwhelm the network.  Use the `if (...) continue` lines to filter the feature sets.
*/
function displayPlaceNames() {
  var url_template = "https://d1ubeg96lo3skd.cloudfront.net/data/overlays/WorldWFS/PlaceNames/{type}/{y}/{y}_{x}.xml.gz";
  formatWFS = new ol.format.WFS({gmlFormat: new ol.format.GML2()});
  var writer = new ol.format.GeoJSON();
  var allFeatures = [];

  sourceVector = new ol.source.Vector({
    loader: function() {
      for (var j in Object.keys(placeNames)) {
        var deltas = Object.keys(placeNames)[j];
        var thisSet = placeNames[deltas];
        var deltaY = parseInt(deltas.split(",")[0]);
        var deltaX = parseInt(deltas.split(",")[1]);
        var maxY = 180/deltaY;
        var maxX = 360/deltaX;
        if (deltaY != 10) continue;
        for (var k in thisSet) {
          var thisPNLayer = thisSet[k];
          if (thisPNLayer.type == "topp:countries") continue;
          // displayPNLayer(thisPNLayer, maxY);
          // continue;
          
          // if (thisPNLayer.type != "10") continue;
          for (var y=0; y<maxY; y++){
            for (var x=0; x<maxX; x++){

              var url = url_template.replace("{type}", thisPNLayer.type).replace(/{y}/g, y).replace("{x}", x);
              //console.log(url);
              var minZoom = thisPNLayer.minZoom ? parseInt(thisPNLayer.minZoom) : 0;
              var maxZoom = thisPNLayer.maxZoom ? parseInt(thisPNLayer.maxZoom) : 999;
              $.ajax({
                  url: url,
                  type: 'GET',
                  crossOrigin: true,
                  minZoom: minZoom,
                  maxZoom: maxZoom,
                  fontColor: thisPNLayer.fontColor,
                  fontName: thisPNLayer.fontName,
                  fontSize: thisPNLayer.fontSize
              }).done(function(response) {                
                  var features = formatWFS.readFeatures(response);
                  // lat and lon are the wrong way round in the WFS, so need to flip
                  for (var i in features) {
                    var feature = features[i];
                    //console.log(feature);
                    var name = "";
                    if (feature.get("full_name_nd")) name = feature.get("full_name_nd");
                    if (feature.get("FullName")) name = feature.get("FullName");
                    var lat, lon;
                    if (feature.get("latitude")) {
                      lat = parseFloat(feature.get("latitude"));
                      lon = parseFloat(feature.get("longitude"));
                    } else if (feature.getGeometry()) {
                      lat = feature.getGeometry().getCoordinates()[0];
                      lon = feature.getGeometry().getCoordinates()[1];
                    }

                    // convert latlon to current projection
                    var newCoord = ol.proj.transform([lon, lat], 'EPSG:4326', map.getView().getProjection());
                    feature.setGeometry(new ol.geom.Point([newCoord[0], newCoord[1]]));
                    feature.setStyle(textStyleFunction);
                    feature.minZoom = this.minZoom;
                    feature.maxZoom = this.maxZoom;
                    feature.fontColor = decimalToRGB(this.fontColor);
                    feature.fontSize = this.fontSize;
                    feature.fontName = this.fontName;
                    feature.name = name;
                    var record = {feature: writer.writeFeature(feature), 
                      minZoom: this.minZoom, 
                      maxZoom: this.maxZoom,
                      name: name,
                      fontColor: this.fontColor,
                      fontSize: this.fontSize,
                      fontName: this.fontName
                    };
                    allFeatures.push(record);
                  }
                  sourceVector.addFeatures(features);
              });
            }
          }
        }
      }
    }
  });
 
  function textStyleFunction() {
    return [
      new ol.style.Style({
          fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new ol.style.Text({
          font: this.fontSize + 'px' + this.fontName,
          fill: new ol.style.Fill({ color: this.fontColor }),
          stroke: new ol.style.Stroke({
            color: "#000", width: 2
          }),
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          text: (Math.pow(2,map.getView().getZoom()-1) >= this.minZoom && Math.pow(2,map.getView().getZoom()-1) <= this.maxZoom) ? this.name : ""
          //text: this.name
        })
      })
    ];
  }
        
  setTimeout (function() {
    console.log(JSON.stringify(allFeatures));
  },20000);                

  var placeNamesLayer = new ol.layer.Vector({
    source: sourceVector
  });
  map.addLayer(placeNamesLayer);
}


/*
  Experimental code used to try and display place names using vector tiles.
  Couldn't get it to work, but may return to it later.
*/
function displayPNLayer (layer, maxY) {
  formatWFS = new ol.format.WFS({gmlFormat: new ol.format.GML2()});
  var zoom = map.getView().getZoom();
  var minZoom = layer.minZoom ? parseInt(layer.minZoom) : 0;
  var maxZoom = layer.maxZoom ? parseInt(layer.maxZoom) : 999;

  //calculate the resolutions for each zoom level
  var projExtent = map.getView().getProjection().getExtent();
  var startResolution = ol.extent.getWidth(projExtent) / 320;
  var resolutions = new Array(maxY);
  for (var i = 0, ii = resolutions.length; i < ii; ++i) {
    resolutions[i] = startResolution / Math.pow(2, i);
  }

  //set up a tile grid
  tileGrid = new ol.tilegrid.TileGrid({
    // minZoom: minZoom,
    // maxZoom: maxZoom,
    extent: projExtent,
    resolutions: resolutions,
    tileSize: [320,320]
  });

  sourceVectorTile = new ol.source.VectorTile({
    tileUrlFunction: tileUrlFunction,
    format: new ol.format.WFS(),
    tileGrid: tileGrid,
    tileLoadFunction: function(tile, url) {
      tile.setLoader(function() {
        $.ajax({
            url: url,
            type: 'GET',
            crossOrigin: true,
            minZoom: minZoom,
            maxZoom: maxZoom,
            fontColor: layer.fontColor,
            fontName: layer.fontName,
            fontSize: layer.fontSize
        }).done(function(response) {
//            console.log(response);
            var features = formatWFS.readFeatures(response);
            console.log(url);
            console.log(features);
            tile.projection_ = map.getView().getProjection();
            // lat and lon are the wrong way round in the WFS, so need to flip
            for (var i in features) {
              var feature = features[i];
              var name = "";
              if (feature.get("full_name_nd")) name = feature.get("full_name_nd");
              if (feature.get("FullName")) name = feature.get("FullName");
              var lat = feature.getGeometry().getCoordinates()[0];
              var lon = feature.getGeometry().getCoordinates()[1];
              // convert latlon to current projection
              var newCoord = ol.proj.transform([lon, lat], 'EPSG:4326', map.getView().getProjection());
              feature.setGeometry(new ol.geom.Point([newCoord[0], newCoord[1]]));
              feature.minZoom = this.minZoom;
              feature.maxZoom = this.maxZoom;
              feature.fontColor = decimalToRGB(this.fontColor);
              feature.fontSize = this.fontSize;
              feature.fontName = this.fontName;
              feature.name = name;
              feature.setStyle(textStyleFunction);
              // console.log("successfully loaded " + url);
            }
            tile.setFeatures(features);
            console.log(tile.getFeatures());
        }).fail(function(err) {
          // console.log(url);
          // console.log(err.responseText);
        });
      });
    }

  });

  console.log(layer.type);
  console.log("zoom: " + zoom);
  console.log("minzoom: " +minZoom);
  console.log("maxzoom: " +maxZoom);
  console.log("resolution: " + map.getView().getResolution());
  console.log((zoom >= minZoom && zoom <= maxZoom));



  function textStyleFunction() {
    return [
      new ol.style.Style({
          fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new ol.style.Text({
          font: this.fontSize + 'px ' + this.fontName,
          fill: new ol.style.Fill({ color: this.fontColor }),
          stroke: new ol.style.Stroke({
            color: "#000", width: 1.5
          }),
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          //text: (Math.pow(2,map.getView().getZoom()-1) >= this.minZoom && Math.pow(2,map.getView().getZoom()-1) <= this.maxZoom) ? this.name : ""
          text: this.name
        })
      })
    ];
  }

  function textStyleFunctionOld() {
    return [
      new ol.style.Style({
          fill: new ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new ol.style.Stroke({
          color: '#3399CC',
          width: 1.25
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({
            color: '#fff', width: 2
          }),
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          //text: map.getView().getZoom() >= minZoom ? this.get('full_name_nd') : ""
          text: this.get('full_name_nd')
        })
      })
    ];
  }


  var layerVectorTile = new ol.layer.VectorTile({
    title:layer.type,
    source: sourceVectorTile,
    projection: map.getView().getProjection(),
    //style: textStyleFunction
  });
  map.addLayer(layerVectorTile);


  function tileUrlFunction(tileCoord) {

    var url = "https://d1ubeg96lo3skd.cloudfront.net/data/overlays/WorldWFS/PlaceNames/{type}/{y}/{y}_{x}.xml.gz"
      .replace('{type}', layer.type)
      .replace('{x}', tileCoord[1].toString())
      .replace(/{y}/g, (maxY + tileCoord[2]).toString());

    console.log(tileCoord);
    // console.log(maxY);
    console.log(url);
    return url;
  }
  var test = new ol.layer.VectorTile({
    source: new ol.source.VectorTile({
      format: formatWFS,
      tileUrlFunction: tileUrlFunction
    })
  });

   //map.addLayer(test);
}
