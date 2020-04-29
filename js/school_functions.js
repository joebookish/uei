/*
 *
 * Set the ranges for the school icon colors 
 *
 *
 */
function schoolSizeRange(){
     /*
     *https://www.uiltexas.org/athletics/conference-cutoffs
     * 6A - > 2220
     * 5A - 1230-2219
     * 4A - 515-1229
     * 3A - 230-514
     * 2A - 105 - 229
     * 1A - 104.9 <
     *
     * small < 230
     * medium > 230, <1230
     * large > 1230
     */   

   return [
        {
            cs_class: "small",
            value: 357,
            text: "less than 357"
        }, 
        {
            cs_class: "medium",
            value: 631,
            text: "greater than or equal to 357, less than or equal to 631"
        },
        {
            cs_class: "large",
            value: 0,
            text: "greater than 631"
        }
    ];

}

function sizeClusterIconCreate(schools){
    var temp_fun = function (cluster) {
        var mscale = schoolSizeRange();
        var childCount = cluster.getChildCount();
        var markers = cluster.getAllChildMarkers();
        var studentCount = 0; 

        markers.forEach(function(e){
            studentCount += e.options.size; 
        });

        var c = ' marker-cluster-';
        if (studentCount < mscale[0].value) {
            c += mscale[0].cs_class;
        } else if (mscale[0].value <= studentCount && studentCount <= mscale[1].value) {
            c += mscale[1].cs_class;
        } else {
            c += mscale[2].cs_class;
        }
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
    }

    return temp_fun;
}

function makeSchoolMarkers(schools,markers){
    
    schools.forEach(function(e){
        //var title = e.campname_g9;
        var title = e.names;
        var marker = L.marker([e.lat, e.lon], { 
            title: title,
            icon: schoolicon(e),
            size: e.size,
            district_g9: e.district_g9,
            hsgrad_4: e.hsgrad_4,
            ps_enroll_t5: e.ps_enroll_t5,
            grad12_ba: e.grad12_ba
        });
        marker.bindPopup(title);
        markers.addLayer(marker);
    
    });
    
    return markers;
   
}

function schoolicon(e){
    var custicon = L.divIcon({
        html: '<span class="icon-school"></span>',
        iconSize: [40, 40],
        className: getUILclass(e.size),
    });

    return custicon;
}

function getUILclass(size){

    var temp_class = 'school-marker';
    var mscale = schoolSizeRange();
    if(size < mscale[0].value) {
        temp_class += " " + mscale[0].cs_class;
    
    }else if(mscale[0].value <= size && size <= mscale[1].value){
        temp_class += " " + mscale[1].cs_class;
    
    }else {
        temp_class += " " + mscale[2].cs_class;
    } 

    return temp_class;
}

/*
 *
 * Update School Year
 *
 */

function updateSchoolsYear(markers,year){
    var jsonFile = "data_prod/schools_2000.json"; 
    jsonFile = jsonFile.replace(/\d+/g,year);

    var p_wait = getJSON(jsonFile);
    p_wait.then(function(data) {
       schools = data; 
   
        var newMarkers = L.markerClusterGroup({
        iconCreateFunction: sizeClusterIconCreate(schools) });   
        
        newMarkers = makeSchoolMarkers(schools,newMarkers);
       
        markers.clearLayers();
        newMarkers.eachLayer(function(layer){
            markers.addLayer(layer);
        });
    });
}

/*
 *
 * Toggle the data shown for schools
 *
 */

function updateSchoolsPopup(markers,schools){
    variable = readSchool();
    console.log(markers);
    markers.eachLayer( function(marker){
        marker._popup.setContent(marker.options.title + 
            " " + variable.name + 
            " " + marker.options[variable.val] 
        );
    });
}
