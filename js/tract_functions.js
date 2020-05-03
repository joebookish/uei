/*
 *
 * Set the ranges for the tract colors 
 *
 *
 */
function tractMoranRange(stat = 1){
    if(stat == 1){
        stat = {
            lower_maj_outlier: 0,
            lower_min_outlier: 0,
            upper_min_outlier: 0,
            upper_maj_outlier: 0
        };
    }
    return [
        { value: 1,
          color: '#fff7fb',
          text: 'less than '+ stat.lower_maj_outlier
        }, 
        { value: 2,
          color: '#ece7f2',
          text: 'greater than or equal to ' + stat.lower_maj_outlier + ', less than ' + stat.lower_min_outlier
        },        
        { value: 3,
          color: '#74a9cf',
          text: 'greater than or equal to ' + stat.lower_min_outlier + ', less than or equal to ' + stat.upper_min_outlier
        },        
        { value: 4,
          color: '#045a8d',
          text: 'greater than' + stat.upper_min_outlier + ', less than or equal to ' + stat.upper_maj_outlier
        },        
        { value: 5,
          color: '#023858',
          text: 'greater than ' + stat.upper_maj_outlier 
        },
        { value: NaN,
          color: '#808080',
          text: 'no data'
        }
   ];

}

/*
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
        { value: 0.1,
          color: '#023858'
        }, 
       { value: 0.0,
          color: '#023858'
        } 
    ];

}
*/

function getColor(d) {
    var colors = tractMoranRange();
    var tot_colors = colors.length;
    var match_color = colors[(tot_colors - 1)].color;

    for(var i = 0; i < tot_colors; i++){
        if(d[1] ==  colors[i].value){
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
            fillColor: getColor(layer.feature.properties.moran_stat),
            className:'tract'
        }),
        layer.bindPopup('<div class="level"><h4>Tract: ' + layer.feature.properties.NAME +
            '</h4>&nbsp;--&nbsp;<h4>Score: ' +
            layer.feature.properties.moran +
            "</h4></div>" +
            buildMoranPopup(layer,moran_variables));
    }

    return style;

}

/*
 *
 * Update the tract, weight matrix,
 * and morans_i_sd data
 * for a new year selection
 *
 */


function updateTractYear(geojson,year){
    var jsonFile = "data_prod/geo_0000.geojson"; 
    var weightMatrix = "data_prod/weight_matrix_2000.json"; 
    jsonFile = jsonFile.replace(/\d+/g,year);
    weightMatrix = weightMatrix.replace(/\d+/g,year);
    
    var p_wait = Promise.all([jsonFile,weightMatrix].map(getJSON));

    p_wait.then(function(data){
        mdata = data[0];
        console.log(mdata);
        weight_matrix = data [1];
       
        addGeojsonProp(mdata,"moran");
        disableMoranChecks(mdata);

        var newGeojson = L.geoJson(mdata,{});

        newGeojson.eachLayer(colorTracts(mdata,weight_matrix));
        geojson.clearLayers();
        newGeojson.eachLayer(function(layer){
            geojson.addLayer(layer);
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

/*
 *
 * create tract popup
 *
 */

function buildMoranPopup(layer,moran_variables){
    var temp_html = "";
    for(i=0; i < moran_variables.name.length; i++ ){
        temp_html += ("<div>"+ 
                    moran_variables.name[i] +
                    ": " +
                    layer.feature.properties[moran_variables.val[i]] +  
                    "</div>");
    }
  
    return temp_html;

}


