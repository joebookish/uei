function colorTracts(mdata){
        
    var moran_variables = readMoran();
    moranRun(mdata,moran_variables.val);

    function style(layer) {
        layer.setStyle({
            fillColor: getColor(layer.feature.properties.moran),
            weight: 2,
            opacity: 1,
            color: '#0E213D',
            dashArray: '3',
            fillOpacity: 0.7
        }),
        layer.bindPopup('<div><strong class="title">Tract: ' + layer.feature.properties.NAME +
            '</strong><strong class="title-right" > Total Score: ' +
            layer.feature.properties.moran +
            "</strong></div>" +
            buildMoranPopup(layer,moran_variables));
    }

    return style;

}

function updateTractYear(geojson,year){
    var jsonFile = "data/geo_0000.geojson"; 
    jsonFile = jsonFile.replace(/\d+/g,year);
    console.log(jsonFile); 
    $.getJSON(jsonFile, function(data) {
       addGeojsonProp(data,"moran");
       mdata = data;
       
       var newGeojson = L.geoJson(mdata,{});
        newGeojson.eachLayer(colorTracts(mdata));
        geojson.clearLayers();
       newGeojson.eachLayer(function(layer){
        geojson.addLayer(layer);
       });
    });
    
}


