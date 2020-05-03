/*
 *
 * Year Slider setups
 *
 */

function updateYear(geojson,markers){
    var dYear = document.getElementById("fYear").innerText; 
    var updateDYear = document.getElementById("dYear");
    updateDYear.firstElementChild.innerText =  updateDYear.innerText.replace(/\d+/g,dYear);
    
    //disable update year button
    var yrbutton = document.getElementById("updateYear"); 
    yrbutton.disabled = true;
    
    updateTractYear(geojson,dYear);
    updateSchoolsYear(markers,dYear);
}

function yearDisplay(){
    //update the slider value
    var sliderY =  document.getElementById("fromYear").value; 
    document.getElementById('fYear').firstElementChild.innerText = sliderY;
   
    //check to see if the sider is different from the display year
    //disable the update year button if years are the same
    var dYear = document.getElementById("dYear").innerText.match(/\d+/g)[0];
    if(dYear == sliderY){
        document.getElementById("updateYear").disabled = true;
    } else {
        document.getElementById("updateYear").disabled = false;
    }

}

/*
 *
 * data layer control
 *
 */

function addDLchecks() {
    var checkboxes = document.querySelectorAll(".leaflet-control-layers-selector");
    checkboxes.forEach(function(checkbox){
        checkbox.insertAdjacentHTML('afterend','<span class="icon-checkbox-checked"></span><span class="icon-checkbox-unchecked"></span>');

    });
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
    
    var selected = document.querySelectorAll("input[name='school-display-data']:checked")[0];
    school_variable.name = getNextSiblings(selected,filterClassName)[0].innerText;
    school_variable.val = selected.value;

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
    '<label class="level"><input type="radio" name="school-display-data" class="leaflet-control-school-selector" value="' +
    item.variable +
    '" name="' +
    item.name +
    '"><span class="icon-radio-checked2"></span><span class="icon-radio-unchecked"></span><span class="school_name_data">' +
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
   document.querySelectorAll("input.leaflet-control-moran-selector:checked").forEach(function(e) {
        moran_variables.name.push(e.getAttribute("name"));
        moran_variables.val.push(e.value);
    });

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
        loaderHTML += '<div><div class="dropdown level" onclick="MdropDown(this)">'+ section[index] 
                    + '<span class="icon-dn"></span>'
                    +'</div><div class="dropdown-container level stack">' 
                    + item + '</div></div>';
    });
    
    return loaderHTML;
}

function moranCheckboxHTML(item,index){
    var temp_loader =  
    '<label class="level"><input type="checkbox" onchange=checkMoranVarCount(this) class="leaflet-control-moran-selector" value="' +
    item.variable.slice(0,-1) +
    '" name="' +
    item.name +
    '"><span class="icon-checkbox-checked"></span><span class="icon-checkbox-unchecked"></span><span>' +
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
    // check if values have changed and enable
    // disable run_moran button
    disableMoranButton();   

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

function disableMoranButton(){
    var old_moran_var = gmoran_variables;
    console.log("old moran",old_moran_var);
    var new_moran_var = readMoran();
    console.log("new moran",new_moran_var);

    var matching = arraysMatch(old_moran_var.val,new_moran_var.val);
    console.log(matching);
    if(matching){
        document.querySelector("#run_moran").disabled = true;
    } else {
        document.querySelector("#run_moran").disabled = false;
    }

}

function arraysMatch (arr1, arr2) {

	// Check if the arrays are the same length
	if (arr1.length !== arr2.length) return false;

	// Check if all items exist and are in the same order
	for (var i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) return false;
	}

	// Otherwise, return true
	return true;

};

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
        swatchHtml += '<div class="level" id="color-' + color.value 
            +'"><span><svg width="48" height="48"><rect width="48" height="48" class="tract" stroke="#3388ff"'  
            + ' stroke-opacity="1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="' + color.color 
            +'" fill-opacity="0.2"/></svg></span><span id="name-'+ color.value +'">'+ color.text
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
        markerHtml += '<div class="level"> <div class="leaflet-marker-icon school-marker ' + range.cs_class + ' leaflet-zoom-animated leaflet-interactive" title="school marker" style="position: relative; width: 40px; height: 40px; opacity: 1;"><span class="icon-school"></span></div><span>'+ range.text + '</span></div>'

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
    var dropdn = e.nextSibling.style.visibility;
    if(dropdn != "visible"){
        //e.nextSibling.style.display = "block";
        e.nextSibling.style.visibility = "visible";
        e.nextSibling.style.height = "100%";
        e.childNodes[1].style.transform = "rotate(180deg)";
    } else {
//        e.nextSibling.style.opacity = 1;
        e.nextSibling.style.visibility = "hidden";
        e.nextSibling.style.height = 0;
        e.childNodes[1].style.transform = "rotate(0deg)";
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
function getNextSiblings(elem, filter) {
    var sibs = [];
    while (elem = elem.nextSibling) {
        if (elem.nodeType === 3) continue; // text node
        if (!filter || filter(elem)) sibs.push(elem);
    }
    return sibs;
}

function filterClassName(elem) {
    if(elem.className == 'school_name_data') {
        return true;
    } else {
        return false;
    } 
}
