function filterNA(year_vals,dataOptions){
    console.log("this is a test");
    var nonas = {},  indexs = [];
    nonas = Object.filterOutVal(year_vals,"NA")
    nonas = Object.keys(nonas);
    dataOptions.forEach(function(element, i){
        console.log(element);
        console.log(element.variable);
        if(nonas.some((key) => key == element.variable.slice(0,-1) )){
            indexs.push(i);
        }
    });
    return indexs.map(i => dataOptions[i])    
}

Object.filterOutVal = function( obj, filter) {
    var result = {}, key;
    // ---------------^---- as noted by @CMS, 
    //      always declare variables with the "var" keyword
    for (key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] != filter) {
            result[key] = obj[key];
        }
    }

    return result;
}
function checkboxPagePaste(){

}
function moranCheckboxHTML(item,index){
    var temp_loader =  
    '<label><div><input type="checkbox" class="leaflet-control-moran-selector" value="' +
    item.variable.slice(0,-1) +
    '" name="' +
    item.name +
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
    
    var dataset = generateDataset(geojson,moran_variables);
    var geospatial = extractGeospatial(geojson);
    
    var moran_vector =  moranTemp(dataset,geospatial);
   
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


function addGeojsonProp(geojson,prop){
    geojson.features.forEach(function(feature){
        feature.properties[prop] = 1;
    });
    return "you did it!";
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

/* UTSA colors:
 * https://imagecolorpicker.com/en
 * https://www.utsa.edu/
 * http://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9
 * blue - #0E213D
 * orange - #DE3E1A
 */
