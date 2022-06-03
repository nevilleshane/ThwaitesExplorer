var wms_layers = [];

var format_Clyne_Thwaites_ALL_0 = new ol.format.GeoJSON();
var features_Clyne_Thwaites_ALL_0 = format_Clyne_Thwaites_ALL_0.readFeatures(json_Clyne_Thwaites_ALL_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Clyne_Thwaites_ALL_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Clyne_Thwaites_ALL_0.addFeatures(features_Clyne_Thwaites_ALL_0);
var lyr_Clyne_Thwaites_ALL_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_Clyne_Thwaites_ALL_0, 
                style: style_Clyne_Thwaites_ALL_0,
                interactive: false,
    title: 'Clyne_Thwaites_ALL<br />\
    <img src="styles/legend/Clyne_Thwaites_ALL_0_0.png" /> hard<br />\
    <img src="styles/legend/Clyne_Thwaites_ALL_0_1.png" /> soft<br />\
    <img src="styles/legend/Clyne_Thwaites_ALL_0_2.png" /> water<br />'
        });

lyr_Clyne_Thwaites_ALL_0.setVisible(true);
var layersList = [lyr_Clyne_Thwaites_ALL_0];
lyr_Clyne_Thwaites_ALL_0.set('fieldAliases', {'bedtype': 'bedtype', 'bed_label': 'bed_label', });
lyr_Clyne_Thwaites_ALL_0.set('fieldImages', {'bedtype': 'TextEdit', 'bed_label': 'TextEdit', });
lyr_Clyne_Thwaites_ALL_0.set('fieldLabels', {'bedtype': 'no label', 'bed_label': 'no label', });
lyr_Clyne_Thwaites_ALL_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});