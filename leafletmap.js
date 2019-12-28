//global variables for testing
var geojson_temp = [];
var data_temp = [];
var dataOptions_temp =[];


// main loading function
$.getJSON("geo_2000.geojson", function(data) {

        // loads the dataOptions 
        var dataOptions = $.getJSON("acs5_variables_original.json");

        //Init Overlays
        var overlays = {};
        
        //Init geojson control
        var geojson_control = {
            "tracts": data

        };

        //Init BaseMaps
        var basemaps = {
          "OpenStreetMaps": L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              minZoom: 2,
              maxZoom: 19,
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
          layers: [basemaps.OpenStreetMaps]
        };


            var geojson = L.geoJson(data, {
              onEachFeature: function (feature, layer) {
                layer.bindPopup(feature.properties.NAME + "<p><b> test: " + feature.properties.P003005 + "</b></p>");
                pub = feature;
              }
            });

            //Set tract colors 
            geojson.setStyle({color:"#32a866"})

            //Render Main Map
            var map = L.map('my-map', mapOptions)
            .fitBounds(geojson.getBounds());

            geojson.addTo(map);


            // set the layer colors 
            geojson.eachLayer(function (layer) {
                if(layer.feature.properties.NAME == '1821.03') {
                    layer.setStyle({fillColor :'blue'})
                }
            });

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
          .layers(basemaps, overlays, geojson_control, {
            position: "topright",
            collapsed: false
          })
          .addTo(map);
        var oldLayerControl = layerControl.getContainer();
        var newLayerControl = $("#layercontrol");
        newLayerControl.append(oldLayerControl);
        $(".leaflet-control-layers-list").prepend("<strong class='title'> Maps</strong><br>");

        $(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");
        // Varaiable Selection 
        var varSelection = new L.FeatureGroup();
        layerControl.addOverlay(varSelection, "time_to_party");
        map.addLayer(varSelection);

        // global variable assign for error checking 
        data_temp = data;
        dataOptions_temp = dataOptions;
        geojson_temp = geojson;


});
