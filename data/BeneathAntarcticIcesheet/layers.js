ol.proj.get("EPSG:3031").setExtent([-1955868.044657, -812267.006223, -805608.894184, 365576.296538]);
var wms_layers = [];

var lyr_Bedmap2_clipped_2000m_rendered_Win_0 = new ol.layer.Image({
                            opacity: 1,
                            title: "Bedmap2_clipped_2000m_rendered_Win",
                            
                            
                            source: new ol.source.ImageStatic({
                               url: "./layers/Bedmap2_clipped_2000m_rendered_Win_0.png",
    attributions: ' ',
                                projection: 'EPSG:3031',
                                alwaysInRange: true,
                                imageExtent: [-2719500.000000, -2372500.000000, 2939500.000000, 2465500.000000]
                            })
                        });

lyr_Bedmap2_clipped_2000m_rendered_Win_0.setVisible(true);
var layersList = [lyr_Bedmap2_clipped_2000m_rendered_Win_0];
