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

function getColor(d) {
    return d > 0.9 ? '#fff7fb' :
           d > 0.8  ? '#ece7f2' :
           d > 0.7  ? '#d0d1e6' :
           d > 0.6  ? '#a6bddb' :
           d > 0.5  ? '#74a9cf' :
           d > 0.4   ? '#3690c0' :
           d > 0.3   ? '#0570b0' :
           d > 0.2   ? '#045a8d' :
                      '#023858';
}

function buildMoranPopup(layer,moran_variables){
    var temp_html = "";
    for(i=0; i < moran_variables.name.length; i++ ){
        temp_html += ("<p>"+ 
                    moran_variables.name[i] +
                    ": " +
                    layer.feature.properties[moran_variables.val[i]] +  
                    "</p>");
    }
  
    return temp_html;

}


