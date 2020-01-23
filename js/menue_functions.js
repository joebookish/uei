function updateYear(geojson){
    var dYear = document.getElementById("fYear").innerHTML; 
    var updateDYear = document.getElementById("dYear");
    updateDYear.innerHTML =  updateDYear.innerHTML.replace(/\d+/g,dYear);

    updateTractYear(geojson,dYear); 
}



/*
 * HTML setters and getters
 */

function readMoran(){
    var moran_variables = {
        "name": [],
        "val":[]
    };

   $("input.leaflet-control-moran-selector:checked").map(function() {
        moran_variables.name.push($(this).attr("name"));
        moran_variables.val.push($(this).val());
    });
    return moran_variables;
}

function sliderHTML(){
    var start_year = 2000;
    loader = '<div><p><label id="dYear">displayed year: '+start_year+'</label>' +
             '<input type="range" id="fromYear" value="' + start_year + '" min="2000" step="1" max="2017"' + 
                    'oninput="document.getElementById(\'fYear\').innerHTML = this.value" />' +
                '<label id="fYear">' + start_year + '</label></p>' +
            '<p><button id="updateYear">change displayed year</button></p></div>';
    return loader;
}

function moranCheckboxSectionHTML(dataOptions){
    var loader = [];
    var section = [];
    sindex = 0;
    dataOptions.forEach(function (item,index) {
        if(index == 0){
            section[sindex] = item.group;
            loader[sindex] = "";
        }
        if(item.group != section[sindex]) {
            console.log("this never runs");
            sindex ++;
            section[sindex] = item.group;
            loader[sindex] = "";
        }
        loader[sindex] += moranCheckboxHTML(item,index);
    });
   
    var loaderHTML = ""; 
    
    loader.forEach(function (item,index){
        loaderHTML += '<div><label>'+ section[index] 
                    +'</label></div><div class="content">' 
                    + item + '</div>';
    });
    
    return loaderHTML;
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

/*
 * general 
 */

function addGeojsonProp(geojson,prop){
    geojson.features.forEach(function(feature){
        feature.properties[prop] = 1;
    });
    return "you did it!";
}


function filterNA(year_vals,dataOptions){
    var nonas = {},  indexs = [];
    nonas = Object.filterOutVal(year_vals,"NA")
    nonas = Object.keys(nonas);
    dataOptions.forEach(function(element, i){
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


/* UTSA colors:
 * https://imagecolorpicker.com/en
 * https://www.utsa.edu/
 * http://colorbrewer2.org/#type=sequential&scheme=YlOrRd&n=9
 * blue - #0E213D
 * orange - #DE3E1A
 */
