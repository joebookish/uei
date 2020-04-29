//global variables for testing
var weight_matrix;
var dataOptions, schoolOptions, schools, data;
var map, geojson;
var mapOptions, basemaps, overlays;
var markers, layerControl;

//data urls
var data_urls = [
    "data_prod/geo_2000.geojson",
    "data_prod/weight_matrix_2000.json",
    "data_prod/acs5_variables.json",
    "data_prod/schools_2000.json",
    "data_prod/schools_variables2.json"
];

//run base map
uei_base();

// load mdata
//create a promises to perform ajax requests
var p_wait = Promise.all(data_urls.map(getJSON));

//return responses and excute other functions
p_wait.then(function(data){
    mdata = data[0];
    weight_matrix= data[1];
    dataOptions = data[2];
    schools = data[3];
    schoolOptions = data[4];
}).then(load_tracts_setup
).then(sidebar_menu_setup)
 .then(year_controller_setup)
 .then(census_controller_setup)
 .then(load_schools_setup)
 .then(school_controller_setup)
 .then(layer_controller_setup)
 .then(key_setup)
 .then(loading_screen);

/*
 *
 * Function Definitions
 *
 */


// main  map
function uei_base(){
    
    // sets default poly line styles 
    // excludes census tracts
    var myStyle = {
        className: 'poly-style'        
    };
    L.Path.mergeOptions(myStyle);
    L.Polyline.mergeOptions(myStyle);
    L.Polygon.mergeOptions(myStyle);
    L.Rectangle.mergeOptions(myStyle);
    L.Circle.mergeOptions(myStyle);
    L.CircleMarker.mergeOptions(myStyle);
    
    /*
     * setup base map and overlays
     */

    //Init Overlays
    overlays = {};

    //Init BaseMaps
    basemaps = {
      "Esri_WorldGrayCanvas": L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {

          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          minZoom: 2,
          maxZoom: 19,
          opacity: 0.9,
          id: "osm.streets"
        }
      )};

    //Map Options
    mapOptions = {
      zoomControl: false,
      attributionControl: false,
      center: [29.41148852531869, 261.5055084228516],
      zoom: 10,
      layers: [basemaps.Esri_WorldGrayCanvas]
    };
    
    //Render Main Map
    map = L.map('my-map', mapOptions);


   
}

// load tracts
function load_tracts_setup(){
    
    // add moran's eye property
    addGeojsonProp(mdata,"moran");

    //Create and color census tracts
    geojson = L.geoJson(mdata, {});
    geojson.eachLayer(colorTracts(mdata));
    
    map.fitBounds(geojson.getBounds());
    geojson.addTo(map);

}

// load schools
function load_schools_setup(){
    //add markers to the map
    
    markers = L.markerClusterGroup({
        iconCreateFunction: sizeClusterIconCreate(schools) });   
   
    markers = makeSchoolMarkers(schools,markers);
    map.addLayer(markers);
 
}

//setup sidebar menu
function sidebar_menu_setup(){
    /*
     * Adding Control
     */
    //Render Zoom Control
    L.control
      .zoom({
        position: "topleft"
      })
      .addTo(map);
    
    //Render Basic sidebar
    var sidebar = L.control
        .sidebar('sidebar', {
            position: 'right'
        })
        .addTo(map);
    
    //Render Layer Control
    layerControl = L.control
      .layers(basemaps,overlays, {
        position: "topright",
        collapsed: false
      })
      .addTo(map);

    // move Layer Control to sidebar slider 
    var oldLayerControl = layerControl.getContainer();
    var newLayerControl = document.querySelector("#layercontrol");
    newLayerControl.append(oldLayerControl);
 
}

//setup layer controller 
function layer_controller_setup(){
    /*
     *
     * Layer Controller 
     *
     */
       
        // add Layer Control for tracts and school
        layerControl.addOverlay(geojson, "census tracts");
        layerControl.addOverlay(markers, "high schools");

        // move tracts and school controlls to new location
        var temp_overlays = document.querySelector(".leaflet-control-layers-overlays");
        document.querySelector(".leaflet-control-layers-overlays").remove();
        document.querySelector('#layercontrol').after(temp_overlays);
        document.querySelector('#layercontrol').remove()


}

//setup year controller
function year_controller_setup(){

    /*
     *
     * Year Controller 
     *
     */
        // set update year function
        document.querySelector('#updateYear').addEventListener("click", (e) => {
            updateYear(geojson,markers);
        });


}

//setup school controller 
function school_controller_setup(){

    /*
     *
     * School Controller
     *
     */

        var sloader = schoolCheckboxSectionHTML(schoolOptions);
        document.querySelector('#school_data').innerHTML = sloader;
        

        // set toggle schools function
        document.querySelector('#school_data').addEventListener("change", function(){
            updateSchoolsPopup(markers,schools);
        });


}


//setup census controller
function census_controller_setup(){
    /*
     *
     * Census Tract Controller
     *
     */
        var tloader = moranCheckboxSectionHTML(dataOptions);
        document.querySelector('#tract_features').innerHTML = tloader;
        
        // check moran variables in checkbox menu
        // see readMoran for default values
        var moran_variables = readMoran();
        moran_variables.name.forEach(function(mvname){
            document.querySelector('[name="' + mvname + '"]').checked = true; 
        });

        disableMoranChecks(mdata);

        // set run moran function
        document.querySelector('#run_moran').addEventListener('click', function(){
            geojson.eachLayer(colorTracts(mdata));
        });


}

// key setup
function key_setup(){
    SchoolColorScale();
}

//remove loading screen
function loading_screen(){
    var loading = document.querySelector('#loadingId');
    if(loading.style.display == 'none'){
        loading.style.display = 'block';
    } else {
        loading.style.display = 'none';
    }
}

