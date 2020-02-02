//global variables for testing
var weight_matrix, morans_i_sd;
var dataOptions, schoolOptions, schools, mdata;

// load data
$.when(
    $.getJSON("data/weight_matrix_2000.json", function(data){
        weight_matrix = data;
    }),

    $.getJSON("data/morans_i_sd.json", function(data){
        morans_i_sd = data;    
    }),

    $.getJSON("data/acs5_variables.json", function(data){
        dataOptions = data;
    }),
    
    $.getJSON("data/schools_variables.json",function(data) {
        schoolOptions = data;
    }),   
    
    $.getJSON("data/schools_2000.json",function(data) {
        schools = data;
    }),

    $.getJSON("data/geo_2000.geojson", function(data) {
        mdata = data;
    })
). then(uei_base);

// main page setup
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

    // add moran's eye property
    addGeojsonProp(mdata,"moran");

    //Init Overlays
    var overlays = {};

    //Init BaseMaps
    var basemaps = {
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
    var mapOptions = {
      zoomControl: false,
      attributionControl: false,
      center: [29.41148852531869, 261.5055084228516],
      zoom: 10,
      layers: [basemaps.Esri_WorldGrayCanvas]
    };

    //Create and color census tracts
    var geojson = L.geoJson(mdata, {});
    geojson.eachLayer(colorTracts(mdata));
    
    //Render Main Map
    var map = L.map('my-map', mapOptions)
        .fitBounds(geojson.getBounds());

    geojson.addTo(map);

    
    //add markers to the map
    //var markers = L.markerClusterGroup();
    
    var markers = L.markerClusterGroup({
        iconCreateFunction: sizeClusterIconCreate(schools) });   
   
    markers = makeSchoolMarkers(schools,markers);
    map.addLayer(markers);
  
    /*
     * Adding Control
     */
    //Render Zoom Control
    L.control
      .zoom({
        position: "topleft"
      })
      .addTo(map);

    var sidebar = L.control
      .sidebar({
        autopan: false,
        container: "sidebar",
        position: "right"
      })
      .addTo(map);

    //Render Layer Control
    var layerControl = L.control
      .layers(basemaps,overlays, {
        position: "topright",
        collapsed: false
      })
      .addTo(map);

    // move Layer Control to sidebar slider 
    var oldLayerControl = layerControl.getContainer();
    var newLayerControl = $("#layercontrol");
    newLayerControl.append(oldLayerControl);

/*
 *
 * Layer Controller 
 *
 */
    
    // setup Layer and Year Controller div
    $(".leaflet-control-layers-list").prepend("<div id='control-wrap'></div>");
    
    // add Layer Control for tracts and school
    layerControl.addOverlay(geojson, "census tracts");
    layerControl.addOverlay(markers, "high schools");
    // remove Layer Control base map toggle
    $(".leaflet-control-layers-base").remove();
    $(".leaflet-control-layers-separator").remove();

    // move tracts and school controlls to new location
    $("#control-wrap").prepend("<div class='control-stack' id='layer-layer-control'><div><p><label>displayed data: </label></p></div></div>");
    var temp_overlays = $(".leaflet-control-layers-overlays").remove()
    $('#layer-layer-control').append(temp_overlays);


/*
 *
 * Year Controller 
 *
 */
    // year controller
    $("#control-wrap").prepend("<div class='control-stack' id='year-layer-control'></div>");
    var loader = sliderHTML();
    $('#year-layer-control').after('<div class="leaflet-control-layers-year">' +
            loader + '</div>');
    // set update year function
    $('#updateYear').click(function(){
        updateYear(geojson,markers);
    });

/*
 *
 * School Controller
 *
 */
    // school features controller 
    $("#control-wrap").after("<div class='control' id='schools'><strong class='title'>School Features</strong></div>");

    var sloader = schoolCheckboxSectionHTML(schoolOptions);
    $('strong:contains("School")').after('<div class="leaflet-control-layers-school">' +
            sloader + '</div>');
    

    // set toggle schools function
    $('.leaflet-control-layers-school').change(function(){
        updateSchoolsPopup(markers,schools);
    });


/*
 *
 * Census Tract Controller
 *
 */
    // census tract features controller, controls moran inpu variables 
    $("#schools").after("<div class='control' id='tracts'><strong class='title'>Census Tract Features</strong></div>");

    var tloader = moranCheckboxSectionHTML(dataOptions);
    
    var tbutton = '<div id="run_moran"><button type="button">Run Moran!</button></div>'
    $('strong:contains("Census Tract")').after('<div class="leaflet-control-layers-moran">' +
            tloader +
            '</div>' + tbutton);
    
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


