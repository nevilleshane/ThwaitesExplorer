ol.proj.get("EPSG:3031").setExtent([-1955868.044657, -812267.006223, -805608.894184, 365576.296538]);
var wms_layers = [];

var lyr_WOA18_grid_T550m_0 = new ol.layer.Image({
                            opacity: 1,
                            title: "WOA18_grid_T550m",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/WOA18_grid_T550m_0.png",
    attributions: ' ',
                                projection: 'EPSG:3031',
                                alwaysInRange: true,
                                imageExtent: [-4590000.000000, -4590000.000000, 4590000.000000, 4590000.000000]
                            })
                        });

lyr_WOA18_grid_T550m_0.setVisible(true);
var layersList = [lyr_WOA18_grid_T550m_0];
