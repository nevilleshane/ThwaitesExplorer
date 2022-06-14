ol.proj.proj4.register(proj4);
ol.proj.get("EPSG:3031").setExtent([-1503245.275111, -454027.997791, -546534.594381, 252862.446636]);
var wms_layers = [];

var format_PGC_20212022_FixedWing_v2_0 = new ol.format.GeoJSON();
var features_PGC_20212022_FixedWing_v2_0 = format_PGC_20212022_FixedWing_v2_0.readFeatures(json_PGC_20212022_FixedWing_v2_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3031'});
var jsonSource_PGC_20212022_FixedWing_v2_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_PGC_20212022_FixedWing_v2_0.addFeatures(features_PGC_20212022_FixedWing_v2_0);
var lyr_PGC_20212022_FixedWing_v2_0 = new ol.layer.Vector({
                declutter: true,
                source:jsonSource_PGC_20212022_FixedWing_v2_0, 
                style: style_PGC_20212022_FixedWing_v2_0,
                interactive: true,
    title: 'PGC_20212022_FixedWing_v2<br />\
    <img src="styles/legend/PGC_20212022_FixedWing_v2_0_0.png" /> FW<br />\
    <img src="styles/legend/PGC_20212022_FixedWing_v2_0_1.png" /> LC130<br />\
    <img src="styles/legend/PGC_20212022_FixedWing_v2_0_2.png" /> <br />'
        });

lyr_PGC_20212022_FixedWing_v2_0.setVisible(true);
var layersList = [lyr_PGC_20212022_FixedWing_v2_0];
lyr_PGC_20212022_FixedWing_v2_0.set('fieldAliases', {'OBJECTID': 'OBJECTID', 'GPS_Name': 'GPS_Name', 'LC130': 'LC130', 'SOPA': 'SOPA', 'Site_Class': 'Site_Class', 'Site_GPS': 'Site_GPS', 'Site': 'Site', 'Lat_DDM': 'Lat_DDM', 'Long_DDM': 'Long_DDM', 'Latitude_D': 'Latitude_D', 'Long_DD': 'Long_DD', 'Elev_m': 'Elev_m', 'Elev_ft': 'Elev_ft', });
lyr_PGC_20212022_FixedWing_v2_0.set('fieldImages', {'OBJECTID': 'Range', 'GPS_Name': 'TextEdit', 'LC130': 'TextEdit', 'SOPA': 'TextEdit', 'Site_Class': 'TextEdit', 'Site_GPS': 'TextEdit', 'Site': 'TextEdit', 'Lat_DDM': 'TextEdit', 'Long_DDM': 'TextEdit', 'Latitude_D': 'TextEdit', 'Long_DD': 'TextEdit', 'Elev_m': 'Range', 'Elev_ft': 'TextEdit', });
lyr_PGC_20212022_FixedWing_v2_0.set('fieldLabels', {'OBJECTID': 'no label', 'GPS_Name': 'no label', 'LC130': 'no label', 'SOPA': 'no label', 'Site_Class': 'no label', 'Site_GPS': 'no label', 'Site': 'no label', 'Lat_DDM': 'no label', 'Long_DDM': 'no label', 'Latitude_D': 'no label', 'Long_DD': 'no label', 'Elev_m': 'no label', 'Elev_ft': 'no label', });
lyr_PGC_20212022_FixedWing_v2_0.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});