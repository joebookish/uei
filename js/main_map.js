//global variables for testing
var weight_matrix, morans_i_sd;
var dataOptions, schools, mdata;

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
    $.getJSON("data/schools.json",function(data) {
        schools = data;
    }),

    $.getJSON("data/geo_2000.geojson", function(data) {
        mdata = data;
    })
). then(uei_base);

// main page setup
function uei_base(){

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


    /*
     * Adding Controls
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

    //Render Layer Control & Move to Sidebar
    var layerControl = L.control
      .layers(basemaps,overlays, {
        position: "topright",
        collapsed: false
      })
      .addTo(map);


    // add sections to sidebar 
    var oldLayerControl = layerControl.getContainer();
    var newLayerControl = $("#layercontrol");
    newLayerControl.append(oldLayerControl);
    $(".leaflet-control-layers-base").remove();
    $(".leaflet-control-layers-list").prepend("<strong class='title'> Year</strong><br>");
    $(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");
    $(".leaflet-control-layers-separator").after("<br><strong class='title'>Moran</strong>");
    $('strong:contains("Moran")').after('<div class="leaflet-control-layers-separator" style=""></div>');

    // add layer control to side bar for tracts and school
    layerControl.addOverlay(geojson, "census tracts");

    var loader = sliderHTML();
    $('strong:contains("Year")').after('<div class="leaflet-control-layers-overlays">' +
            loader + '</div>');

    // add moran variables and run button to side bar 
    var loader = "";
    dataOptions.forEach(function (item,index) {
            loader += moranCheckboxHTML(item,index);
    });

    var button = '<div id="run_moran"><button type="button">Run Moran!</button></div>'
    $('strong:contains("Moran")').after('<div class="leaflet-control-layers-overlays">' +
            loader +
            '</div>' + button);

    // pre check moran variables for load and set javascript altert 
    moranCheckboxSetup();

    // load tract colors
    $().ready(function(){
        geojson.eachLayer(colorTracts(mdata));
    });

    // set run moran function
    $('#run_moran').click(function(){
        geojson.eachLayer(colorTracts(mdata));
    });

    // set update year function
    $('#updateYear').click(function(){
        updateYear(geojson);
    });
}


