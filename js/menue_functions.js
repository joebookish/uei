/*
 *
 * Year Slider setups
 *
 */

function updateYear(geojson,markers){
    var dYear = document.getElementById("fYear").innerHTML; 
    var updateDYear = document.getElementById("dYear");
    updateDYear.innerHTML =  updateDYear.innerHTML.replace(/\d+/g,dYear);
    
    //disable update year button
    document.getElementById("updateYear").disabled = true;
    
    updateTractYear(geojson,dYear);
    updateSchoolsYear(markers,dYear);
}

function yearDisplay(){
    //update the slider value
    var sliderY =  document.getElementById("fromYear").value; 
    document.getElementById('fYear').innerHTML = sliderY;
   
    //check to see if the sider is different from the display year
    //disable the update year button if years are the same
    var dYear = document.getElementById("dYear").innerHTML.match(/\d+/g)[0];
    if(dYear == sliderY){
        document.getElementById("updateYear").disabled = true;
    } else {
        document.getElementById("updateYear").disabled = false;
    }

}

function sliderHTML(){
    var start_year = 2000;
    loader = '<div><p><label id="dYear">displayed year: '+start_year+'</label>' +
             '<input type="range" id="fromYear" value="' + start_year + '" min="2000" step="1" max="2015"' + 
                    'oninput=yearDisplay()>' +
                '<label id="fYear">' + start_year + '</label></p>' +
            '<p><button id="updateYear" disabled >change displayed year</button></p></div>';
    return loader;
}



/*
 *
 * Schools Toggle Setup
 *
 */



function readSchool(){
    var school_variable = {
        "name": '',
        "val":''
    };

   $("input[name='school-display-data']:checked").map(function() {
        school_variable.name = $(this).next().text();
        school_variable.val = $(this).val();
    });
    return school_variable;
}


function schoolCheckboxSectionHTML(schoolOptions){
    var loaderHTML = ""; 
    
    schoolOptions.forEach(function (item,index) {
        if(index != 0){
            loaderHTML += schoolCheckboxHTML(item,index);
        } 
    });
  
    return loaderHTML;
}

function schoolCheckboxHTML(item,index){
    var temp_loader =  
    '<label><input type="radio" name="school-display-data" class="leaflet-control-school-selector" value="' +
    item.variable +
    '" name="' +
    item.name +
    '"><span>' +
    item.name +
    '</span></label>';

    return temp_loader;
}


/*
 * 
 * Moran menue setups
 *
 */

function collapseVars() {
    var coll = document.getElementsByClassName("dropdown");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight == "" || content.style.maxHeight == "0px"){
          content.style.maxHeight = content.scrollHeight + "px";
        } else {
          content.style.maxHeight = "0px";
        } 
      });
    }
}

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

function moranCheckboxSectionHTML(dataOptions){
    var loader = [];
    var section = [];
    var sindex = 0;
    dataOptions.forEach(function (item,index) {
        if(index == 0){
            section[sindex] = item.group;
            loader[sindex] = "";
        }
        if(item.group != section[sindex]) {
            sindex ++;
            section[sindex] = item.group;
            loader[sindex] = "";
        }
        loader[sindex] += moranCheckboxHTML(item,index);
    });
   
    var loaderHTML = ""; 
    
    loader.forEach(function (item,index){
        loaderHTML += '<div><button class="dropdown"><span>'+ section[index] 
                    + '</span><span class=“icon-L-arrow”></span>'
                    +'</button><div class="dropdown-container">' 
                    + item + '</div></div>';
    });
    
    return loaderHTML;
}

function moranCheckboxHTML(item,index){
    var temp_loader =  
    '<label><input type="checkbox" class="leaflet-control-moran-selector" value="' +
    item.variable.slice(0,-1) +
    '" name="' +
    item.name +
    '"><span>' +
    item.name +
    '</span></label>';

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


