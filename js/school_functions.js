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

    return {
        sm_max: 50, 
        md_max: 500 
    };

}

function sizeClusterIconCreate(schools){
    var temp_fun = function (cluster) {
        var childCount = cluster.getChildCount();
        var markers = cluster.getAllChildMarkers();
        var studentCount = 0; 

        markers.forEach(function(e){
            studentCount += e.options.size; 
        });

        var c = ' marker-cluster-';
        if (studentCount < schoolSizeRange().sm_max) {
            c += 'small';
        } else if (studentCount < schoolSizeRange().md_max) {
            c += 'medium';
        } else {
            c += 'large';
        }
        return new L.DivIcon({ html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
    }

    return temp_fun;
}

function makeSchoolMarkers(schools,markers){
    
    schools.forEach(function(e){
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
    if(size < schoolSizeRange().sm_max) {
        temp_class += ' sm';
    
    }else if(size < schoolSizeRange().md_max){
        temp_class += ' md';
    
    }else {
        temp_class += ' lg';
    } 

    return temp_class;
}

/*
 *
 * Update School Year
 *
 */

function updateSchoolsYear(markers,year){
    var jsonFile = "data/schools_2000.json"; 
    jsonFile = jsonFile.replace(/\d+/g,year);
    $.getJSON(jsonFile, function(data) {
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
