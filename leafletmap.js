//global variables for testing
var weight_matrix, morans_i_sd;
var dataOptions, schools, mdata;

// load map data
$.when(
    $.getJSON("weight_matrix_2000.json", function(data){
        weight_matrix = data;
    }),

    $.getJSON("morans_i_sd.json", function(data){
        morans_i_sd = data;    
    }),

    $.getJSON("acs5_variables.json", function(data){
        dataOptions = data;
    }),
    $.getJSON("schools.json",function(data) {
        schools = data;
    }),

    $.getJSON("geo_2000.geojson", function(data) {
        mdata = data;
    })
). then(uei_base);


// main page setup function
function uei_base(){
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
      ),
      "Google-Map": L.tileLayer(
        "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "google.street"
        }
      ),
      "Google-Satellite": L.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "google.satellite"
        }
      ),
      "Google-Hybrid": L.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "google.hybrid"
        }
      )
    };

    //Map Options
    var mapOptions = {
      zoomControl: false,
      attributionControl: false,
      center: [29.41148852531869, 261.5055084228516],
      zoom: 10,
      layers: [basemaps.Esri_WorldGrayCanvas]
    };


    var geojson = L.geoJson(mdata, {});

        //Render Main Map
        var map = L.map('my-map', mapOptions)
        .fitBounds(geojson.getBounds());

        geojson.addTo(map);

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
      .layers(basemaps, overlays, {
        position: "topright",
        collapsed: false
      })
      .addTo(map);


    // not sure about this code...
    var oldLayerControl = layerControl.getContainer();
    var newLayerControl = $("#layercontrol");
    newLayerControl.append(oldLayerControl);
    $(".leaflet-control-layers-list").prepend("<strong class='title'> Maps</strong><br>");
    $(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");
    $(".leaflet-control-layers-separator").after("<br><strong class='title'>Moran</strong>");
    $('strong:contains("Moran")').after('<div class="leaflet-control-layers-separator" style=""></div>');


    // add layer control for tracts and school
    var overlay = new L.FeatureGroup();
    layerControl.addOverlay(geojson, "census tracts");


    // add menu options to select moran variables
    var loader = "";
    dataOptions.forEach(function (item,index) {
            loader += moranCheckboxHTML(item,index);
    });

    var button = '<div id="run_moran"><button type="button">Run Moran!</button></div>'
    $('strong:contains("Moran")').after('<div class="leaflet-control-layers-overlays">' +
            loader +
            '</div>' + button);

    // set check values
    moranCheckboxSetup();

    // get selected varaibles for moran's eye
    var moran_variables = {
        "name": [],
        "val":[]
    };

    $().ready(function(){
        $("input.leaflet-control-moran-selector:checked").map(function() {
            moran_variables.name.push($(this).attr("name"));
            moran_variables.val.push($(this).val());
        });
        console.log(moran_variables);
        moranRun(mdata,moran_variables.val);
        geojson.eachLayer(style);
    });


    $('#run_moran').click(function(){
        $("input.leaflet-control-moran-selector:checked").map(function() {
            moran_variables.name.push($(this).attr("name"));
            moran_variables.val.push($(this).val());
        });
        moranRun(mdata,moran_variables.val);
        console.log(moran_variables);
        geojson.eachLayer(style);
    });

    function style(layer) {
        layer.setStyle({
            fillColor: getColor(layer.feature.properties.moran),
            weight: 2,
            opacity: 1,
            color: '#0E213D',
            dashArray: '3',
            fillOpacity: 0.7
        }),
        layer.bindPopup('<div><strong class="title">Tract: ' + layer.feature.properties.NAME +
            '</strong><strong class="title-right" > Total Score: ' +
            layer.feature.properties.moran +
            "</strong></div>" +
            buildMoranPopup(layer,moran_variables));
    }

// add year slider and pull new year and weight matrix
/*
        var geojson = L.geoJson(mdata, {
          onEachFeature: function (feature, layer) {
            layer.bindPopup("Tract: " + feature.properties.NAME + "<p><b> test: " + feature.properties.P003005 + "</b></p>");
            pub = feature;
          }
        });
*/


    // set the layer colors
    /*
    geojson.eachLayer(function (layer) {
        if(layer.feature.properties.NAME == '1821.03') {
            layer.setStyle({fillColor :'blue'})
        }
    });
    */

    // run moran's eye based on selected variaibles
    // assign value to moran property in features >> properties

    // set the layer colors
    /*
    geojson.eachLayer(function (feature) {
        feature.setStyle({
                        fillColor: getColor(feature.feature.properties.moran),
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    });
    });
         //Set tract colors
        geojson.setStyle({color:"#32a866"})
   */

}


