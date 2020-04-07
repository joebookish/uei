function moranRun(mdata,moran_variables, weight_matrix){
    
    var moran_vector =  moranI(mdata,weight_matrix);

    setMoranProp(mdata,moran_vector);

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

function generateDataset(mdata,moran_variables,firstIndexOnly=false){
    var temp_dataset = [];
    
    for(var i=0; i<mdata.features.length; i++){
        var geofeature = mdata.features[i];
        var gindex = i;
        var temp_moran = [];
        moran_variables.forEach(function(moranvar,mindex){
            temp_moran.push(geofeature.properties[moranvar]);
        });
        temp_dataset.push(temp_moran);
        if(firstIndexOnly){
            if(i == 0) {
                break;
            }
        }
    }
    
    return temp_dataset;
}


