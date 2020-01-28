ol.proj.get("EPSG:3031").setExtent([-2121324.774989, -985454.727771, -1392460.301467, -41668.678723]);
var wms_layers = [];

var format_Larter_paleo_groundinglines_0 = new ol.format.GeoJSON();
var features_Larter_paleo_groundinglines_0 = format_Larter_paleo_groundinglines_0.readFeatures(json_Larter_paleo_groundinglines_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3031'});
var jsonSource_Larter_paleo_groundinglines_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Larter_paleo_groundinglines_0.addFeatures(features_Larter_paleo_groundinglines_0);
var lyr_Larter_paleo_groundinglines_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_Larter_paleo_groundinglines_0, 
                style: style_Larter_paleo_groundinglines_0,
                interactive: true,
    title: 'Larter_paleo_groundinglines<br />\
    <img src="styles/legend/Larter_paleo_groundinglines_0_0.png" /> 10 ka<br />\
    <img src="styles/legend/Larter_paleo_groundinglines_0_1.png" /> 15 ka<br />\
    <img src="styles/legend/Larter_paleo_groundinglines_0_2.png" /> 20 ka<br />\
    <img src="styles/legend/Larter_paleo_groundinglines_0_3.png" /> 5 ka<br />\
    <img src="styles/legend/Larter_paleo_groundinglines_0_4.png" /> <br />'
        });

lyr_Larter_paleo_groundinglines_0.setVisible(true);
var layersList = [lyr_Larter_paleo_groundinglines_0];
lyr_Larter_paleo_groundinglines_0.set('fieldAliases', {'layer': 'layer', });
lyr_Larter_paleo_groundinglines_0.set('fieldImages', {'layer': 'TextEdit', });
lyr_Larter_paleo_groundinglines_0.set('fieldLabels', {'layer': 'inline label', });
lyr_Larter_paleo_groundinglines_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});