/*
 *
 * Set the ranges for the tract colors 
 *
 *
 */
function tractMoranRange(){

    return [
        { value: "NA",
          color: '#00000000'
        },
        { value: 0.9,
          color: '#fff7fb'
        }, 
        { value: 0.8,
          color: '#ece7f2'
        },        
        { value: 0.7,
          color: '#d0d1e6'
        },        
        { value: 0.6,
          color: '#a6bddb'
        },        
        { value: 0.5,
          color: '#74a9cf'
        },        
        { value: 0.4,
          color: '#3690c0'
        },        
        { value: 0.3,
          color: '#0570b0'
        },        
        { value: 0.2,
          color: '#045a8d'
        },        
        { value: 0.0,
          color: '#023858'
        } 
    ];

}

function getColor(d) {
    var colors = tractMoranRange();
    var tot_colors = colors.length;
    var match_color = colors[(tot_colors - 1)].color;

    for(var i = 0; i < tot_colors; i++){
        if(d > colors[i].value){
            match_color = colors[i].color;
            break
        }
    }
    
    return match_color;
}

function colorTracts(mdata, weight_matrix){
        
    var moran_variables = readMoran();
    moranRun(mdata,moran_variables.val,weight_matrix);

    function style(layer) {
        layer.setStyle({
            fillColor: getColor(layer.feature.properties.moran),
            className:'tract'
        }),
        layer.bindPopup('<div><strong class="title">Tract: ' + layer.feature.properties.NAME +
            '</strong><strong class="title-right" > Total Score: ' +
            layer.feature.properties.moran +
            "</strong></div>" +
            buildMoranPopup(layer,moran_variables));
    }

    return style;

}

/*
 *
 * Update the tract, weight matrix,
 * and morans_i_sd_year data
 * for a new year selection
 *
 */


function updateTractYear(geojson,year){
    var jsonFile = "data_prod/geo_0000.geojson"; 
    var weightMatrix = "data_prod/weight_matrix_2000.json"; 
    jsonFile = jsonFile.replace(/\d+/g,year);
    weightMatrix = weightMatrix.replace(/\d+/g,year);
    
    $.getJSON(jsonFile, function(data) {
       addGeojsonProp(data,"moran");
       mdata = data;
       disableMoranChecks(mdata);

       $.getJSON(weightMatrix, function(wmdata){
            weight_matrix = wmdata;

            var newGeojson = L.geoJson(mdata,{});
            newGeojson.eachLayer(colorTracts(mdata,weight_matrix));
            geojson.clearLayers();
            newGeojson.eachLayer(function(layer){
                geojson.addLayer(layer);
            });
           
       });

     });
    
}

// check what variables the tract has

function checkTractVarvsMoran(mdata){
   var menuMoranVars = readMoran(false).val;
   var definedMoranVars = generateDataset(mdata,menuMoranVars,true)[0];
   definedMoranVars = definedMoranVars.map(function(e,i){
       if(e != "NA" && e != undefined){
            return false;
       } else {
            return true;
       }
   });
   return definedMoranVars;
}

// disable checkboxes 
function disableMoranChecks(mdata){
    definedMoranVars = checkTractVarvsMoran(mdata);
    $("input.leaflet-control-moran-selector").each(function(i){
        if(definedMoranVars[i]){
            $(this).prop("checked",false);
        }
        $(this).attr("disabled",definedMoranVars[i])
    });
}

/*
 *
 * create tract popup
 *
 */

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


