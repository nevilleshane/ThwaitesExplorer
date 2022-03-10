$(document).ready(function() {

// alert("width: " + $(document).width() + " height: " + $(window).height());

  if (isMobile) {
    // Start with the menu hidden in mobile mode
    $("#menu_btn").show();
    $("#showonmap_btn").show();
  }


  /*
    Display Cookie compliance message until Understood button is clicked
  */
  $("#cookieButton").click(function(){
    console.log('Understood');
    var expire=new Date();
    expire=new Date(expire.getTime()+7776000000);

    setCookie("cookieCompliancyAccepted", "here", expire);
    $("#myCookieConsent").hide(400);
  });
  testFirstCookie();

  /*
    Close the splash screen
  */
  $("#close_splash").click(function() {
    $("#splash").hide("slow");
    $("#menu").show("slow");
  });

  /*
    Display the menu when the menu button is clicked
  */
  $("#menu_btn").click(function() {
      if (isMobile) {
        $('#hidden_map').hide(); // hide the hidden map during flipping
        $('.flipper').addClass('flip');
        setTimeout(function() {
          $('#hidden_map').show();
        }, 1000);
      } else {
        $("#menu").show("slow");
      }
      $("#menu_btn").hide();
  });

  /*
    Hide the menu when the hide button is clicked
  */
  $("#hide_btn").click(function() {
      if (isMobile) {
        $('#hidden_map').hide(); // hide the hidden map during flipping
        $('.flipper').removeClass('flip');
        setTimeout(function() {
          $('#hidden_map').show();
        }, 1000);
      } else {
        $("#menu").hide("slow");
      }
      $("#menu_btn").show();
  });


  /*
    Hide the menu when the hide button is clicked
  */
  $("#tutorial_btn").click(function() {
      if (isMobile) {
        $('#splash').show();
        $("#menu_btn").show();
        $('#hidden_map').hide(); // hide the hidden map during flipping
        $('.flipper').removeClass('flip');
        setTimeout(function() {
          $('#hidden_map').show();
        }, 1000);
      } else {
        $('#splash').show('slow');
        $("#menu").hide("slow");
      }

  });

  /*
    Close the popup when the close button is clicked
  */
  $("#close_btn").click(function() {
    $("#popup").hide("fade");
    if (isMobile) {
      $("#menu").removeClass("disabled");
      $("#menufooter").removeClass("disabled");
    }
  });

  /*
    Stop the audio when the silent button is clicked
  */
  $("#silent_btn").click(function() {
    var audioElement = document.getElementById("popup_audio");
    audioElement.pause();
    if (isMobile) {
      $("#popup").hide();
      $("#menu").removeClass("disabled");
      $('#hidden_map').hide(); // hide the hidden map during flipping
      $('.flipper').removeClass('flip');
      setTimeout(function() {
        $('#hidden_map').show();
      }, 1000);
      $("#menu_btn").show();
    }
  });

  $("#showonmap_btn").click(function() {
    if (isMobile) {
      $("#popup").hide();
      $("#menu").removeClass("disabled");
      $('#hidden_map').hide(); // hide the hidden map during flipping
      $('.flipper').removeClass('flip');
      setTimeout(function() {
        $('#hidden_map').show();
      }, 1000);
      $("#menu_btn").show();
    }
  });


  /*
    Take a snapshot of the main map canvas and save as a jpeg file
    (can't use png as some canvases are too large)
  */
  $("#screenshot_btn").click(function() {
    var canvas = $("#map").find("canvas")[0];
    var image = canvas.toDataURL("image/jpeg");
    var link = document.createElement("a");
    link.href = image;
    link.download = 'ThwaitesExplorer_snapshot.jpg';
    link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

  });

  /*
    Display the settings menu when the settings button is clicked
  */
  $("#settings_btn").click(function() {
    $(".settings-container").show("slide", {direction: "down"}, 800);
  });

  /*
    Close the settings menu when the close settings button is clicked
  */
  $("#close_settings_btn").click(function() {
    $(".settings-container").hide("slide", {direction: "down"}, 800);
  });

  /*
    Toggle the scalebar with the scalebar switch
  */
  scalebar = getCookie("scalebar") === "" ? true : (getCookie("scalebar") === 'true');
  $("#scalebar_switch").prop('checked', scalebar);
  $("#scaleline").toggle(scalebar);
  $("#scalebar_switch").click(function() {
    scalebar = this.checked;
    $("#scaleline").toggle(scalebar);
    setCookie("scalebar", scalebar, 365)
  });

  /*
    Toggle the legend with the legend switch
  */
  showLegendSetting = getCookie("showLegendSetting") === "" ? true : (getCookie("showLegendSetting") === 'true');
  $("#legend_switch").prop('checked', showLegendSetting);

  $("#legend_switch").click(function() {
    showLegendSetting = this.checked;
    if ($("#legend_img").attr("src") && $("#legend_img").attr("src") !== "") {
      $("#legend").toggle(this.checked);
    }
    setCookie("showLegendSetting", showLegendSetting, 365)
  });


  /*
    Toggle the outline layers with the outlines switch
  */
  showOutlines = getCookie("showOutlines") === "" ? true : (getCookie("showOutlines") === 'true');
  $("#outline_switch").prop('checked', showOutlines);

  $("#outline_switch").click(function() {
    showOutlines = this.checked;
    for (var lyr of alwaysOnLayers) {
      lyr.setVisible(showOutlines);
    }
    setCookie("showOutlines", showOutlines, 365)
  });

  /*
    Toggle place name labels with the place names switch
  */
  showPlacenames = getCookie("showPlacenames") === "" ? true : (getCookie("showPlacenames") === 'true');
  $("#place_names_switch").prop('checked', showPlacenames);

  $("#place_names_switch").click(function() {
    showPlacenames = this.checked;
    placeNamesLayer.setVisible(showPlacenames);
    setCookie("showPlacenames", showPlacenames, 365)
  });

  /*
    Toggle overview map with the overview switch
  */
  showOverview = getCookie("showOverview") === "" ? !isMobile : (getCookie("showOverview") === 'true');
  $("#overview_switch").prop('checked', showOverview);
  $(".ol-overviewmap").toggle(showOverview);

  $("#overview_switch").click(function() {
    showOverview = this.checked;
    $(".ol-overviewmap").toggle(showOverview);
    setCookie("showOverview", showOverview, 365)
  });


  /*
    Toggle the RGB function with the RGB switch
  */
  showRGB = getCookie("showRGB") === "" ? false : (getCookie("showRGB") === 'true');
  $("#rgb_switch").prop('checked', showRGB);

  $("#rgb_switch").click(function() {
    showRGB = this.checked;
    setCookie("showRGB", showRGB, 365)
  });

  /*
    Toggle whether to display the user's location with the location switch.
    This will only work if we switch to https
  */
  $("#location_switch").click(function() {
    geolocation.setTracking(this.checked);
    if (this.checked) map.addLayer(geolocationLayer);
    else map.removeLayer(geolocationLayer);
  });

  // Set some initial values
  parents = [];
  parent_titles = [];
  parent_menu_ids = [];
  showElevation = true;
  scaleTable = {};
  scaleUnits = "";
  tablePopupObj = {};
  alwaysOnLayers = new Set();
  showSeabedNames = true;
  webpages_url = "data/info_pages/html/";
  loadFromUrl = false;

  // check for parameters in the URL of the current page
  var query = window.location.search.substring(1);
  url_params = parse_query_string(query);
  display_params = {...url_params}
  updateDisplayParams("", remove=true);

  if (url_params.menu_id) {
    // skip intro
    startThwaitesExplorer();
    // close splash screen
    $("#close_splash").click();
    loadFromUrl = true;
  }
  if (url_params.zoom) {
    map.getView().setZoom(url_params.zoom);
    map2.getView().setZoom(url_params.zoom);
  }
  if (url_params.center) {
    map.getView().setCenter(url_params.center.split`,`.map(x=>+x));
    map2.getView().setCenter(url_params.center.split`,`.map(x=>+x));
  }

  // Populate the menu using the overlays in the mapOverlays.json file
  console.log(mapOverlays);
  populateMenu(mapOverlays, null);

  //display place names
  displayPlaceNameFeatures();

  /*
    If user clicks on elevation text, send the coords to the mapClick function
  */
  $("#elev").click(function(evt) {
    var x = evt.clientX;
    var y = evt.clientY;
    mapClick(x, y, evt);
  });

  /*
    Handle what happens if the user clicks on the map
  */
  map.on('click', function(evt) {
    var x = evt.pixel[0];
    var y = evt.pixel[1];
    mapClick(x, y, evt);
  });

  function mapClick(x, y, evt) {

    $(".new_user_btn-container").hide("slide", {direction: "down"}, 1500);
    $("#elev").text("");
    $("#elev_triangle").hide();

    //first check if clicking on a circle in a table layer (and not a placeName)
    var featureAndCoords;
    if (evt.pixel) {
      featureAndCoords = map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          if (["placeNamesLayer", "Antarctic Coast", "Thwaites Surface Catchment"].includes(layer.get('title'))) return null;
          var geometry = feature.getGeometry();
          var mypoint = geometry.getClosestPoint(evt.coordinate);
          // if multiple features withing tolerance range, return closest
          var closestFeature = layer.getSource().getClosestFeatureToCoordinate(evt.coordinate);
          return [closestFeature, mypoint];
        }, {"hitTolerance":7});
    }

    if (featureAndCoords) {
        var feature = featureAndCoords[0];
        var feature_coord = featureAndCoords[1];
        //ignore placename label features
        if (typeof feature.fontName != "undefined") return;

        var content="";
        // if popup details included in the geojson
        if (feature.get('popup')) {

          var popup = feature.get('popup');

          if (popup.desc) {
            content += "<p style='width:250px'>"+popup.desc+"</p>";
          }
          if (popup.url) {
            content += "<a target='_blank' href='" + popup.url + "'>More info</a>";
          }

        }
        else if (feature.get('layer')) {
          var layer = feature.get('layer');
           $("#elev").text(layer).css({top:y-50+"px", left:x-20+"px", color:"white"});
           $("#elev_triangle").css({top:y-8+"px", left:x-8+"px"}).show();
        }
        // table popups
        else {

          var url;
          if (tablePopupObj.base_url && tablePopupObj.url_property) {
            url = tablePopupObj.base_url + feature.get(tablePopupObj.url_property);
          }
          else if (tablePopupObj.base_url && !tablePopupObj.url_property) {
            url = tablePopupObj.base_url;
          }
          else if (!tablePopupObj.base_url && tablePopupObj.url_property) {
            url = feature.get(tablePopupObj.url_property);
          }

          var image_url;
          if (tablePopupObj.image_base_url && tablePopupObj.image_url_property && feature.get(tablePopupObj.image_url_property)) {
            console.log(feature.get(tablePopupObj.image_url_property));
            image_url = tablePopupObj.image_base_url + feature.get(tablePopupObj.image_url_property);
          }
          else if (tablePopupObj.image_base_url && !tablePopupObj.image_url_property) {
            image_url = tablePopupObj.image_base_url;
          }
          else if (!tablePopupObj.image_base_url && tablePopupObj.image_url_property) {
            image_url = feature.get(tablePopupObj.image_url_property);
          }
          if (image_url) {
            content += "<div align='center' style='width:270px;'>";
            content += "<a target='_blank' href='" + url + "'><img style='width:150px;height:150px;' src='" + image_url +"'></img>";
            var image_text_keys = tablePopupObj.image_text_keys;
            // image text for tidal stations
            if (image_text_keys.length > 0 && tablePopupObj.layer == "Tide Station Histories") {
              content += "<div align='center' class='popupimagetext' style='width:109px;'>"+feature.get(image_text_keys[0]);
              content += "<p style='font-size: 18px;'>mm/year</p>";
              content += "<p style='font-size: 12px;'>"+feature.get(image_text_keys[1])+"</p></div>";
            }
            content += "</a><br/>";
          }
          
          if (tablePopupObj.properties) {
            content += "<div align='left'>";

            for (var i in tablePopupObj.properties) {
              var key = tablePopupObj.properties[i];
              // make sure any keys which originally had duplicate names are renamed back to
              // their original vales by removing the #repeated_key# extension
              var key_text = key.replace("#repeated_key#", "");
              var value = feature.get(key);
              var value_text = "n/a";
              if (value) {
                value_text = feature.get(key).replace("|", ",") + " " + tablePopupObj.units[i];
              }
              content +=  key_text + " = " + value_text + "<br/>";
            }

            if (url) content += "<a target='_blank' href='" + url + "'>More info</a>";
            content += "</div>";
          }
          if (image_text_keys && image_text_keys.length > 0) content += "</div>";
        }

        if (content !== '') {
          console.log(content)
          content_element.innerHTML = content;
          table_popup_overlay.setPosition(feature_coord);
          $("#table-popup").css("width", "max-content");
        }

    } else if (showRGB) {
      //Show ARGB value at pixel
      var hidden_map1 = document.getElementById("hidden_map");

      var canvas1 = hidden_map1.getElementsByTagName("canvas");
      var ctx1 = canvas1[0].getContext("2d");
      var ratio1 = getPixelRatio(ctx1);
      var p1 = ctx1.getImageData(x*ratio1, y*ratio1, 1, 1).data;
      var argb = "ARGB: " + p1[3] + ", " + p1[0] + ", " + p1[1] + ", " + p1[2];
      $("#elev").text(argb).css({top:y-45+"px", left:x-40+"px", position:"absolute", color:"white"});
      $("#elev_triangle").css({top:y-8+"px", left:x-8+"px"}).show();

    } else if (showElevation) {
      var coord = map.getCoordinateFromPixel([x,y]);
      var ll = ol.proj.toLonLat(coord, map.getView().getProjection());
      //check that we are not out of the map view extent
      if (coord[0] > params.view_extent[2] || coord[0] < params.view_extent[0]) return;
      if (coord[1] > params.view_extent[3] || coord[1] < params.view_extent[1]) return;
      $.ajax({
        type:"GET",
        url:gmrtUrl,
        data: {
          "format": "text/plain",
          "longitude": ll[0].toFixed(7),
          "latitude": ll[1].toFixed(7)
        },
        success: function(response) {
          var textColor;
          if (parseFloat(response) > 0) {
            textColor = "#ffcc00";
          } else {
            textColor = "#99ccff";
          }
          $("#elev").text(response+" meters").css({top:y-50+"px", left:x-40+"px", color:textColor});
          $("#elev_triangle").css({top:y-8+"px", left:x-8+"px"}).show();
        }
      });

    } else{
      // get z-value from the hidden map which displays only the top layer
      // (this prevents trying to get values from the base map)
      var hidden_map = document.getElementById("hidden_map");
      var canvas = hidden_map.getElementsByTagName("canvas");
      var ctx = canvas[0].getContext("2d");
      var ratio = getPixelRatio(ctx);
      var p = ctx.getImageData(x*ratio, y*ratio, 1, 1).data;
      // find closest color in the scaleTable
      closest = getClosestColor(p[0], p[1], p[2]);
      console.log(map.getView().getZoom());
      console.log(p);
      console.log(closest);
      if (closest) {
        $("#col_sq").css('background-color', 'rgb('+closest+')');
        var z_val = scaleTable[closest];
        // add units if not already included in scale table
        if (z_val.split(' ').length == 1) {
          z_val += scaleUnits;
        }
        $("#elev").text(z_val).css({top:y-50+"px", left:x-40+"px", color:"white"});
        $("#elev_triangle").css({top:y-8+"px", left:x-8+"px"}).show();

      }
    }
    // $("#hidden_map").hide();
  }

  //Make the DIV element draggagle:
  if (!isMobile) {
    dragElement(document.getElementById(("menu")), false);
    dragElement(document.getElementById(("popup")), false);
    //for tablets, make the whole of the legend draggable, since it will be smaller
    dragElement(document.getElementById(("legend")), $("#legend").css("zoom") < 1);
    dragElement(document.getElementById(("settings")), false);
    dragElement(document.getElementsByClassName(("ol-overviewmap"))[0], true);
  }

});


/*
  Populate the menu using the overlays in the mapOverlays.json file
*/
function populateMenu(overlays, title) {
  var menu = $("#menu_list");
  //clear the menu
  menu.empty();
  //disable back button if no parents in list
  $("#back_btn").prop("disabled", parents.length === 0);

  if (!title) {
    title = "Choose a topic";
  }
  $("#menuheader").text(title);
  //add menu items for each child overlay
  $.each(overlays, function(i) {
    var item;
    var row = $("<tr/>");
    var info = $("<td/>");
    var info_link = $("<a/>").attr("target", "_blank");
    var more = $("<td/>");
    var info_icon = $("<i/>").addClass("menu_icon menu_info");
    var icon = $("<i/>").addClass("menu_icon");
    var overlay = overlays[i];

    //add info icon of overlay contains info url
    if (overlay.info) {
      info_icon.addClass("fa fa-info-circle");
      info_link.append(info_icon);
      //open overlay.info url as an iframe in info.html
      var info_url = overlay.info;
      if (overlay.info.indexOf(webpages_url) != -1) {
        var topic = info_url.split(webpages_url)[1].replace(".html", "");
        info_link.attr("href", "info.html?topic=" + topic);
      } else {
        info_link.attr("href", info_url);
      }
      // COMMENTED OUT LINKS FOR NOW - UNCOMMENTED BY DFP ON 05 MARCH 2020
      info.append(info_link);
    }
    //if overlay is of type overview, set as menu header
    if (overlay.type == "overview") {
      //item = $("<th/>").text(overlay.name);
      item = $("<th/>");

      // COMMENTED OUT LINKS FOR NOW
      // var overview_topic = overlay.info.split(webpages_url)[1].replace(".html", "");
      // var overview_link = $("<a/>").attr("target", "_blank").attr("href", "info.html?topic=" + overview_topic).text(overlay.name);
      var overview_link = $("<p/>").text(overlay.name);
      overview_link.addClass("overview_link");
      item.append(overview_link);
      row.addClass("menu_overview");
      more.append(icon);
    //add as menu item
    } else {
      item = $("<td/>").text(overlay.name);
      row.addClass("menu_item");
      //handle click event
      item.click(function() {
        menuItemClicked(overlay, overlays, icon, title);
      });
      more.click(function() {
        menuItemClicked(overlay, overlays, icon, title);
      });
      //if overlay is of type dir, add an angle-right icon
      if (overlay.type == "dir") {
        icon.addClass("fa fa-angle-right");
      }
      more.append(icon);
    }
    row.append(info);
    row.append(item);
    row.append(more);
    menu.append(row);

    // if this item is part of the tree-branch specified in the URL parameters, simulate a click in the item
    if (url_params.menu_id && url_params.menu_id.startsWith(overlay.menu_id) && overlay.type != "overview") {
      menuItemClicked(overlay, overlays, icon, title);
      if (url_params.menu_id != overlay.menu_id || overlay.type == "dir") {
        return false;
      }
    }
  });
}

/*
  Function to handle what to do when a menu item is clicked
*/
function menuItemClicked(overlay, parent, icon, title) {
  //if current menu item, don't do anything
  if (icon.hasClass("fa-check")) return;

  //make sure all existing menu items are unchecked
  $(".fa-check").removeClass("fa fa-check");

  //update url in browser bar, without reloading
  if (overlay.type !== 'dir' && overlay.menu_id !== url_params.menu_id) updateDisplayParams("seq_num", remove=true);
  updateDisplayParams({menu_id:overlay.menu_id});


  //perform appropraite action depending on overlay type
  console.log(overlay.type);
  switch(overlay.type) {
    //sub-menu
    case "dir":
      //keep track of parents in case back button is pressed
      parents.push(parent);
      parent_titles.push(title);
      parent_menu_ids.push(overlay.menu_id.substring(0,overlay.menu_id.length-2));

      var $menu = $("#menu_list");
      //repopulate menu with childrem of this item
      populateMenu(overlay.children, overlay.name);

      $("#menuheader").hide().show("slide", {direction: "right"}, 500);
      $("#menubody").hide().show("slide", {direction: "right"}, 500);


      $("#back_btn").unbind('click').click(function() {
        //repopulate menu with parent

        url_params.menu_id = parent_menu_ids.pop();
        if (url_params.menu_id === "")
          url_params.menu_id = "00" //main menu
        // not sure whether to update url in browser bar
        // window.history.pushState({},'Title','?'+ object_to_query_string(url_params));
        populateMenu(parents.pop(), parent_titles.pop());
        $("#menuheader").hide().show("slide", {direction: "left"}, 500);
        $("#menubody").hide().show("slide", {direction: "left"}, 500);
      });
      break;
    case "tile_512":
      displayTile512(overlay, true);
      break;
    case "tiled":
      displayTiled(overlay, true);
      break;
    case "wms_512":
      displayWMS512(overlay, true);
      break;
    case "overlay_sequence":
      displayOverlaySequence(overlay, true);
      break;
    case "NOAAtile_256":
      displayNOAA(overlay, true);
      break;
    case "arcgis_tile_256":
      displayArcGIS(overlay, true);
      break;
    case "image":
      displayImage(overlay, true);
      break;
    case "xb_map":
      displayXBMap(overlay, true);
      break;
    case "multi_layer":
      displayMultiLayers(overlay);
      break;
    case "table":
      displayTable(overlay, true);
      break;
    case "geojson":
      displayGeojson(overlay, true);
      break;
    default:
      console.log("Unknown Overlay Type: " + overlay.type);
  }
  //place a check mark next to the selected row
  icon.addClass("fa fa-check");

  //show the popup with text and audio
  showPopup(overlay);
}

/*
  Remove all layers except the GMRT base and perform any other tidying up
  before switching to new overlay.  Only remove GMRT base layer if removeGMRT is
  set to true, eg if the overlay.hideOpacitySlider has been set to true, or if
  this is a multi_layer overlay
*/
function removeAllLayers(removeGMRT) {
  var layersToRemove = [];
  //alwaysOnLayers = [];
  map.getLayers().forEach(function(lyr) {

    if (lyr.getProperties().basemap !== true) {
      layersToRemove.push(lyr);
    }
  });

  var len = layersToRemove.length;
  for(var i = 0; i < len; i++) {
      map.removeLayer(layersToRemove[i]);
  }

  /* TODO: Handle remove GMRT */
   if (!removeGMRT && map.getView().getProjection() == gmrt_params.merc.projection) {
     map.addLayer(gmrtLayer);
  //   map.addLayer(terra);
  //   map.addLayer(ibcso);
  //   map.addLayer(lima);
   }
  if (showSeabedNames) map.addLayer(placeNamesLayer);
  $("#sequence").hide();
  $("#legend").hide();
  $("#opacity").hide();
  $("#ldeo_label").hide();
  $("#elev").text("");
  $("#elev_triangle").hide();
  scaleTable = {};
  scaleUnits = "";
  closer.click();
}

/*
  A function to remove a layer using its name/title
*/
function removeLayerByName(name) {
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    if (layer.get('title') !== undefined && layer.get('title') === name) {
        layersToRemove.push(layer);
    }
  });

  var len = layersToRemove.length;
  for(var i = 0; i < len; i++) {
      map.removeLayer(layersToRemove[i]);
  }
}

/*
  After a sequence layer has been loaded, remove the old layers.  Use the timeout delay to try and make it smooth.
*/
function removeOldSequenceLayers(sequence, layer_title) {
  setTimeout(function() {
    map.getLayers().forEach(function (layer) {
      if (layer && layer.get('title') && layer.get('title').includes(sequence) && layer.get('title') !== layer_title) {
          removeLayerByName(layer.get('title'));
      }
    });
  }, 300);
}


/*
  make sure all tables are removed by removing any untitled vector layers
*/
function removeAllTables() {
  var layersToRemove = [];
  map.getLayers().forEach(function (layer) {
    if (layer.type == "VECTOR" && layer.get('title' === undefined)) {
        layersToRemove.push(layer);
    }
  });

  var len = layersToRemove.length;
  for(var i = 0; i < len; i++) {
      map.removeLayer(layersToRemove[i]);
  }

  tablePopupObj = {};
}

/*
  Show the popup for the selectd overlay
*/
function showPopup(overlay) {
  if (!overlay.aboutAlertURL) {
    $("#popup").hide("fade");
    return;
  }

  //get the text for the popup
  $.ajax({
    type: "GET",
    url: overlay.aboutAlertURL,
    crossOrigin: true,
    success: function(response) {
      var text = response.replace(/â/g, "'").match(/([^:]*):([\s\S]*)/m);
      $("#popupheader").text(overlay.name);
      $("#popup_text").html(text[2]).append("<br/><br/>").scrollTop(0);

      //play the audio
      if (overlay.aboutAudioURL) {
        $("#audio_btn").click(function() {
          playAudio(overlay.aboutAudioURL);
          if (isMobile) {
            $("#popup").hide();
            $("#menu").removeClass("disabled");
            $('#hidden_map').hide(); // hide the hidden map during flipping
            $('.flipper').removeClass('flip');
            setTimeout(function() {
              $('#hidden_map').show();
            }, 1000);
            $("#menu_btn").show();
          }
        });
      }
      $("#popup").show("fade");
      if (isMobile) {
        $("#menu").addClass("disabled");
        $("#menufooter").addClass("disabled");
      }
    }
  });
}

/*
  Play the audio given a url
*/
function playAudio(url) {
  var audioElement = document.getElementById("popup_audio");
  audioElement.src = url;
  audioElement.play();
}

/*
  Show the legend for an overlay
*/
function showLegend(overlay) {
  $("#legend_img").attr("src",overlay.legendPath);
  if (showLegendSetting  && !isMobile) $("#legend").show();
}

/*
  Display the layer title
*/
function showTitle(title) {
  $("#layer_title").text(title);
}

/*
  Display the layer credit
*/
function showCredit(credit) {
  $("#layer_credit").text("    Credit: " + credit);
}


/*
  set the link for the info button
*/
function setInfoLink(url) {
  //open url as an iframe in info.html
  if (url.indexOf(webpages_url) != -1) {
    var topic = url.split(webpages_url)[1].replace(".html", "");
    $("#info_link").attr("href", "info.html?topic=" + topic);
  } else {
    $("#info_link").attr("href", url);
  }
  $("#info_link").show();
}

/*
  Get the scale table for a layer using the scalePath.
  This will be used to get the z-values on clicking the map.
*/
function getScaleTable(scalePath) {
  $.ajax({
    type: "GET",
    url: scalePath,
    crossOrigin: true,
    success: function(response) {
      var lines = response.split("\n");
      for (var i in lines) {
        var line = lines[i].split("\t");
        if (line[0] !== "R,G,B" && line[0] !== "") scaleTable[line[0]] = line[1];
      }
    }
  });
}

/*
  setup the opacity slider
*/
function setSlider(layer, overlay) {
  if (overlay.hideOpacitySlider) {
    ($("opacity").hide());
    //change the min zoom to 1 for these layers, since they tend to be close ups.
    map.getView().setMinZoom(1);
    return;
  }
  //only want to change opacity of top layer, so need to unbind previous layers
  $("#opacity_slider").unbind();
  $("#opacity_slider").on("input", function(e) {
    //for sequence layers, set opacity to 0 for all but the top layer
    map.getLayers().forEach(function (l) {
      if (l.get("title") === "Sequence" && l != layer) {
          l.setOpacity(0);
      }
    });

    layer.setOpacity($(e.target).val());
  });

  $("#opacity").show();
  //reset the min zoom level
  if (overlay.numLevels == 1 && isMobile) {
    //change the min zoom to 1 for these layers, since they tend to be close ups.
    map.getView().setMinZoom(1);
  } else {
    map.getView().setMinZoom(2);
  }
}

/*
  Everything that needs to be done when displaying a layer on the map
*/
function displayLayer(layer, overlay, removeOldLayers) {

  //hide new user button
  $(".new_user_btn-container").hide("slide", {direction: "down"}, 1500);

  //determine whether place names should be shown
  showSeabedNames = overlay.showSeabedNames;

  //remove old layers if not a multilayer layer
  //only remove GMRT base layer is the hideOpacitySlider parameter is true
  //or if the parent overlay type is multi_layer
  //This only applies for polar projections
  var removeGMRT = overlay.hideOpacitySlider || overlay.parent_type == "multi_layer" || overlay.mapProjection != 0;
  //don't remove base layer of multilayer with overlay sequence
  if (overlay.parent_type == "multi_layer" && overlay.type == "overlay_sequence") removeOldLayers = false;

  if (removeOldLayers) {
    removeAllLayers(removeGMRT);
  } else {
    // just remove alwaysOnLayers, so we can reload them at the top
    for(var alyr of alwaysOnLayers) map.removeLayer(alyr);
  }
  //switch projection if necessary
  if (overlay.mapProjection != params.proj_code) switchProjection(overlay.mapProjection, overlay)
  if (!overlay.mapProjection) { 
     if (map.getView().getProjection() != merc_proj) switchProjection(0, overlay);
  }

  //add the new layer to the map
  map.addLayer(layer);

  //add always-on layers at the top (if the projection is right)
  for(var lyr of alwaysOnLayers) {
    try {
      if (lyr.get('projection') == map.getView().getProjection()) {
        map.addLayer(lyr);
      }
    } catch(error) {console.log(error);}
  }

  //if sequence layer, remove old sequence layers
  if (overlay.type == "overlay_sequence") {
    removeOldSequenceLayers(overlay.title, layer.getProperties().title);
  }

  //set the opacity slider
  setSlider(layer, overlay);

  //show legend if available
  if (overlay.legend) {
    showLegend(overlay);
  } else {
    $("#legend_img").attr("src", "");
  }
  if (overlay.info) {
    setInfoLink(overlay.info);
  }
  if (overlay.title) {
    showTitle(overlay.title);
  }
  if (overlay.credit) {
    showCredit(overlay.credit);
  }
  if (overlay.scalePath) {
    getScaleTable(overlay.scalePath);
  }
  if (overlay.legendUnits) {
    scaleUnits = overlay.legendUnits;
  }
  if (overlay.type != "dir") {
    showElevation = overlay.showElevation;
  }
  if (overlay.type == "overlay_sequence") {
    $("#sequence").show();
  }
  if (overlay.numLevels == 1 && isMobile) {
    //change the min zoom to 1 for these layers, since they tend to be close ups.
    map.getView().setMinZoom(1);
  } else {
    map.getView().setMinZoom(2);
  }
  if (overlay.wesn && removeOldLayers) {
    // if loading page from url parameters, use those to center the and zoom layer
    if (loadFromUrl) {
      map.getView().setZoom(url_params.zoom);
      map2.getView().setZoom(url_params.zoom);
      map.getView().setCenter(url_params.center.split`,`.map(x=>+x));
      map2.getView().setCenter(url_params.center.split`,`.map(x=>+x));
      loadFromUrl = false;
    } else {
      //otherwise, use the listed extent
      var wesn = overlay.wesn.split(',');
      var extent = ol.proj.transformExtent(
        [parseInt(wesn[1]), parseInt(wesn[2]), parseInt(wesn[0]), parseInt(wesn[3])],
        "EPSG:4326", map.getView().getProjection()
      );
      map.getView().fit( extent, map.getSize() );
      map2.getView().fit( extent, map2.getSize() );
    }
  }
  //only the first load is from the url parameters, so set this to false now
  loadFromUrl = false

  //on map 2 (the hidden map), just display top layer, unless clickLayerBelow is set to true
  if (overlay.clickLayerBelow !== true) {
    map2.setLayerGroup(new ol.layer.Group());
  }
  map2.addLayer(layer);

}

/*
  scale for Retina and other hi-res displays
*/
function getPixelRatio(ctx) {
  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                      ctx.mozBackingStorePixelRatio ||
                      ctx.msBackingStorePixelRatio ||
                      ctx.oBackingStorePixelRatio ||
                      ctx.backingStorePixelRatio || 1;
  var ratio = devicePixelRatio / backingStoreRatio;
  return ratio;
}

/*
  find closest color in the scaleTable
*/
function getClosestColor(r0,g0,b0) {
  var land_greys = ["0", 0, 192, 203, 178];
  if (r0 == b0 && b0 == g0 && ($.inArray(r0, land_greys) > -1)) return null;

  var min = 999999;
  var closest = null;
  console.log(scaleTable);
  for (var j in Object.keys(scaleTable)) {
    var rgb1 = Object.keys(scaleTable)[j].split(',');
    var r1 = parseInt(rgb1[0]);
    var g1 = parseInt(rgb1[1]);
    var b1 = parseInt(rgb1[2]);
    var d =   Math.pow(r0-r1,2) + Math.pow(g0-g1,2) + Math.pow(b0-b1,2);
    if (d < min) {
      closest = rgb1;
      min = d;
    }
  }
  return closest;
}

/*
  functions to hangle dragging an element by its header
*/
function dragElement(elmnt, dragOnAll) {
  if (elmnt === null) return;
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header") && !dragOnAll) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    document.getElementById(elmnt.id + "header").ontouchstart = dragTouchStart;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragTouchStart;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }


  function dragTouchStart(e) {
    // disable bounce on Safari on ipads
    disableBounce(e);
    var touch = e.touches[0];
    // get the mouse cursor position at startup:
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.ontouchmove = elementTouchDrag;
  }


  function elementDrag(e) {
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.right = "auto";
    elmnt.style.bottom = "auto";
  }

  function elementTouchDrag(e) {
    var touch = e.touches[0];
    // calculate the new cursor position:
    pos1 = pos3 - touch.clientX;
    pos2 = pos4 - touch.clientY;
    pos3 = touch.clientX;
    pos4 = touch.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    elmnt.style.right = "auto";
    elmnt.style.bottom = "auto";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;

    // convert positioning from pixels to % so that elements can be reposition if the orientation of a tablet is changed
    var w = $(document).width();
    var h = $(document).height();
    elmnt.style.top = (parseInt(elmnt.style.top.replace("px", "")) / h * 100) + "%";
    elmnt.style.left = (parseInt(elmnt.style.left.replace("px", "")) / w * 100) + "%";
  }

  /*
    Disable default touch moving of screen on ipads
  */
  function disableBounce(event) {
    event.preventDefault();
  }

}

function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = decodeURIComponent(pair[1]);
    // If first entry with this name
    if (typeof query_string[key] === "undefined") {
      query_string[key] = decodeURIComponent(value);
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}

function object_to_query_string(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");   
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  console.log("saving cookie: " + cname + " value: " + cvalue)
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


function testFirstCookie(){
  var offset = new Date().getTimezoneOffset();
  // if ((offset >= -180) && (offset <= 0)) { // European time zones
    var visit=getCookie("cookieCompliancyAccepted");
    if (visit==""){
       $("#myCookieConsent").fadeIn(400); // Show warning
     } else {
      // Already accepted
     }    
  // }
}