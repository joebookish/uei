function moranCheckboxHTML(item,index){
    var temp_loader =  
    '<label><div><input type="checkbox" class="leaflet-control-moran-selector" value="' +
    item.variable +
    '"><span>' +
    item.name +
    '</span></div></label>';

    return temp_loader;
}

function moranCheckboxSetup(){
    var limit = 5;
    
    // check specific boxes
    /*checkValues = ["DP02_0058E","DP02_0063E","DP02_0110E","DP03_0081E","DP05_0034E"];
    $.each(checkValues, function(i, val){

       $("input[value='" + val + "']").prop('checked', true);

    });
    */
   
    // check the first boxes within limit
    for(i=0;i<limit;i++){
        $('input.leaflet-control-moran-selector').eq(i).prop('checked',true)
    }
    // limit number of checks
    $('input.leaflet-control-moran-selector').on('change', function(evt) {
        if($('input.leaflet-control-moran-selector:checked').length > limit) {
            this.checked = false;
            alert("only "+limit+" variables may be chosen at once")
        }
    });
}

function moranRun(geojson,moran_variables){
    //dataset - is a vector set used to calculate the Moran's eye
    //geojson.features is the geospatial data    


    // make the weights ... not super sure what any of this is doing... 
    let adjlist = new Map()

    //add region0's adjust list
    let thisadj = new Map()

    thisadj.set(0,80) 
    thisadj.set(1,30) //1 is the id of the region, 30 is the corresponding weight
    thisadj.set(2,40)
    thisadj.set(3,10)
    adjlist.set(0,thisadj)
    
    var dataset = generateDataset(geojson,moran_variables);
    var geospatial = extractGeospatial(geojson);
    
    var moran_vector =  moranTemp(dataset,geospatial,adjlist);
   
    setMoranProp(geojson,moran_vector);

    return moran_vector;
    //return [dataset,geospatial,adjlist];
    //return CalcLMI(dataset,geospatial,adjlist,true);
}

function setMoranProp(data, moran_vector){
    if(isPropSet(data,"moran").some(element => element === false)){
        addGeojsonProp(data,"moran");       
    }

    data.features.forEach(function(feature, index){
        feature.properties.moran = moran_vector[index];
    });

    return "the moran vector assigned " + moran_vector.toString();
    
}

function isPropSet(data,prop){
    var proptest = []; 
    data.features.forEach(function(feature){
        proptest.push(feature.properties.hasOwnProperty(prop));
    });
    return proptest;
}

function extractGeospatial(geojson){
    
    var temp_geospatial = [];
    geojson.features.forEach(function(item,index){
        temp_geospatial.push(item.geometry);
    });

    return temp_geospatial;
}

function generateDataset(geojson,moran_variables){
    var temp_dataset = [];
    geojson.features.forEach(function(geofeature,gindex){
        var temp_moran = [];
        (moran_variables);
        moran_variables.forEach(function(moranvar,mindex){
            temp_moran.push(geofeature.properties[moranvar]);
        });
        temp_dataset.push(temp_moran);
    });

    return temp_dataset;
}

function getColor(d) {
    return d > 0.8 ? '#800026' :
           d > 0.6  ? '#BD0026' :
           d > 0.5  ? '#E31A1C' :
           d > 0.4  ? '#FC4E2A' :
           d > 0.3   ? '#FD8D3C' :
           d > 0.2   ? '#FEB24C' :
           d > 0.1   ? '#FED976' :
                      '#FFEDA0';
}

function addGeojsonProp(geojson,prop){
    geojson.features.forEach(function(feature){
        feature.properties[prop] = 1;
    });
    return "you did it!";
}


