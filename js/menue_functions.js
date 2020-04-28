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
    var yrbutton = document.getElementById("updateYear"); 
    yrbutton.disabled = true;
    
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
    '<label class="level-item"><input type="radio" name="school-display-data" class="leaflet-control-school-selector" value="' +
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

function readMoran(checked = true){
    var moran_variables = {
        "name": [],
        "val":[]
    };
    if(checked){
       $("input.leaflet-control-moran-selector:checked").map(function() {
            moran_variables.name.push($(this).attr("name"));
            moran_variables.val.push($(this).val());
        });
    } else {
        $("input.leaflet-control-moran-selector").map(function() {
            moran_variables.name.push($(this).attr("name"));
            moran_variables.val.push($(this).val());
        });
    }

    //default values html has not rendered 
    if(moran_variables.val.length == 0){
        moran_variables.val = ["DP02_0058","DP02_0061"];
        moran_variables.name = ["Population 25 years and over","High school graduate (includes equivalency)"];
    }

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
        loaderHTML += '<div><div class="dropdown" onclick="MdropDown(this)">'+ section[index] 
                    + '<span class="icon-dn"></span>'
                    +'</div><div class="dropdown-container">' 
                    + item + '</div></div>';
    });
    
    return loaderHTML;
}

function moranCheckboxHTML(item,index){
    var temp_loader =  
    '<label class="level-item"><input type="checkbox" onchange=checkMoranVarCount(this) class="leaflet-control-moran-selector" value="' +
    item.variable.slice(0,-1) +
    '" name="' +
    item.name +
    '"><span>' +
    item.name +
    '</span></label>';

    return temp_loader;
}

// disable checkboxes 
function disableMoranChecks(mdata){
    // disable checkboxes 
    // for years when data is not availble
    definedMoranVars = checkTractVarvsMoran(mdata);
    var checkBoxes = document.querySelectorAll(".leaflet-control-moran-selector");
    
    for(var i=0;i<checkBoxes.length;i++){
        checkBoxes[i].disabled = false;
        if(definedMoranVars[i]){
            checkBoxes[i].disabled = true;
            checkBoxes[i],checked = false;
        }     
    }
}

function checkMoranVarCount(checkthis){
    // allow only 5 
    // variables at once
    var limit = 5; 
    var checkcount = 0;
    var checkBoxes = document.querySelectorAll(".leaflet-control-moran-selector");
    disableMoranChecks(mdata);

    for(var i=0;i<checkBoxes.length;i++){
       if(checkBoxes[i].checked == true){
           checkcount++;
           if(checkcount > limit){
               checkthis.checked = false;
               checkBoxes.forEach(function(e){
                   if(e.checked == false){
                        e.disabled = true;
                   }
               });
               alert("only "+limit+" variables may be chosen at once");
               break;
           }
       } 
    }
}

/*
 *
 * Key  
 *
 */
//tracts
function TractScaleHTML(colors){
    
    var swatchHtml = ""; 
    var temp = "temp range value";
    colors.forEach(function(color){
        swatchHtml += '<div class="level-item" id="color-' + color.value 
            +'"><svg width="50" height="50"><rect width="50" height="50" class="tract" stroke="#3388ff"'  
            + ' stroke-opacity="1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="' + color.color 
            +'" fill-opacity="0.2"/></svg><span id="name-'+ color.value +'">'+ color.text
            +'</span></div>';
    });

    return swatchHtml;
}

function TractColorScale(colors){
    
    document.querySelector("#tract_color_scale").innerHTML = TractScaleHTML(colors);
    return "this worked";
}

// schools
function SchoolScaleHTML(){
    var srange = schoolSizeRange();
    var temp = "temp text";
    var markerHtml = '';
    
    srange.forEach(function(range){
        markerHtml += '<div class="level"> <div class="leaflet-marker-icon school-marker ' + range.cs_class + ' leaflet-zoom-animated leaflet-interactive" title="school marker" style="position: relative; width: 40px; height: 40px; opacity: 1;"><span class="icon-school"></span></div><div class="level-item-right"><span>'+ range.text + '</span></div></div>'

    });
    
    return markerHtml;
}

function SchoolColorScale(){
    
    document.querySelector("#school_color_scale").innerHTML = SchoolScaleHTML();
    return "this worked";
}
/*
 *
 * general 
 *
 */

//dropdown
function MdropDown(e){
    var dropdn = e.nextSibling.style.display;
    if(dropdn != "block"){
        e.nextSibling.style.display = "block";
    } else {
        e.nextSibling.style.display = "none";
    }
}


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


