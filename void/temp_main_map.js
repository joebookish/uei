//global variables for testing
var weight_matrix, morans_i_sd, morans_i_mean;
var dataOptions, schoolOptions, schools, mdata;
var map, geojson;
var mapOptions, basemaps, overlays;
var markers, layerControl;

//run base map
uei_base();

// load mdata
$.when(
    $.getJSON("data_prod/geo_2000.geojson", function(data) {
        mdata = data;
    }),
    $.getJSON("data_prod/weight_matrix_2000.json", function(data){
        weight_matrix = data;
    }),
    $.getJSON("data_prod/morans_i_sd.json", function(data){
        morans_i_sd = data;
        morans_i_sd_year = morans_i_sd.filter(e => e.year == "2000");
    })

).then(load_tracts_setup);

// load schools data
$.when(
    $.getJSON("data_prod/schools_2000.json",function(data) {
        schools = data;
    })

).then(load_schools_setup);

sidebar_menu_setup();
year_controller_setup();

//load the tracts data display options
$.when(
    $.getJSON("data_prod/acs5_variables.json", function(data){
        dataOptions = data;
    })
 
).then(census_controller_setup);

//load the school data display options
$.when(
    $.getJSON("data_prod/schools_variables2.json",function(data) {
        schoolOptions = data;
    })   
    
).then(school_controller_setup)
 .then(style_js);


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
    var newLayerControl = $("#layercontrol");
    newLayerControl.append(oldLayerControl);
 
}

//setup layer controller 
function layer_controller_setup(){
    /*
     *
     * Layer Controller 
     *
     */
        
        // setup Layer and Year Controller div
        $(".leaflet-control-layers-list").addClass("section")
        $(".leaflet-control-layers-list").prepend('<div id="control-wrap" class="level"></div>');
        
        // add Layer Control for tracts and school
        layerControl.addOverlay(geojson, "census tracts");
        layerControl.addOverlay(markers, "high schools");
        // remove Layer Control base map toggle
        $(".leaflet-control-layers-base").remove();
        $(".leaflet-control-layers-separator").remove();

        // move tracts and school controlls to new location
        $("#control-wrap").prepend("<div id='layer-layer-control'><div class='level-item title is-1'>displayed data:</div></div>");
        var temp_overlays = $(".leaflet-control-layers-overlays").remove()
        $('#layer-layer-control').append(temp_overlays);


}

//setup year controller
function year_controller_setup(){

    /*
     *
     * Year Controller 
     *
     */
        // year controller
        var loader = sliderHTML();
        $('#control-wrap').prepend('<div class="leaflet-control-layers-year">' +
                loader + '</div>');
        // set update year function
        $('#updateYear').click(function(){
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
        // school features controller 
        $("#control-wrap").after("<div class='control level leaflet-control-layers-school' id='schools'><strong class='title is-1 level-item'>student outcomes</strong></div>");

        var sloader = schoolCheckboxSectionHTML(schoolOptions);
        $('strong:contains("student")').after(sloader);
        

        // set toggle schools function
        $('.leaflet-control-layers-school').change(function(){
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
        // census tract features controller, controls moran inpu variables 
        $("#schools").after("<div class='control level' id='tracts'><strong class='title is-1 level-item'>census tract features</strong></div>");

        var tloader = moranCheckboxSectionHTML(dataOptions);
        
        var tbutton = '<button id="run_moran" class="button level-item" type="button">update features</button>'
        $('strong:contains("census tract")').after(tloader + tbutton);
        
        // pre check moran variables for load and set javascript altert 
        moranCheckboxSetup();
        disableMoranChecks(mdata);

        // load tract colors
        $().ready(function(){
            // add event listeners to Moran checkbox sections
            collapseVars();   
            geojson.eachLayer(colorTracts(mdata));
        });

        // set run moran function
        $('#run_moran').click(function(){
            geojson.eachLayer(colorTracts(mdata));
        });


}
