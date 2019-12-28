//bind geojson
var data_temp = [];
var dataOptions_temp =[];

    $.getJSON("geo_2000.geojson", function(data) {

var dataOptions = $.getJSON("geo_2015.geojson");

            
data_temp = data;
dataOptions_temp = dataOptions;
//Init Overlays
var overlays = {};

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

console.log("does this run")

    var geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.NAME + "<p><b> test: " + feature.properties.P003005 + "</b></p>");
        pub = feature;
      }
    });

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
var oldLayerControl = layerControl.getContainer();
var newLayerControl = $("#layercontrol");
newLayerControl.append(oldLayerControl);
$(".leaflet-control-layers-list").prepend("<strong class='title'>Base Maps</strong><br>");
$(".leaflet-control-layers-separator").after("<br><strong class='title'>Layers</strong>");

//######## Leaflet Draw
var editableLayers = new L.FeatureGroup();
layerControl.addOverlay(editableLayers, "Cosmetic Layer");
map.addLayer(editableLayers);

var drawOptions = {
  position: "topleft",
  draw: {
    polyline: true,
    polygon: {
      allowIntersection: false, // Restricts shapes to simple polygons
      drawError: {
        color: "#e1e100", // Color the shape will turn when intersects
        message: "<strong>Oh snap!<strong> you can't draw that!" // Message that will show when intersect
      }
    },
    circle: true, // Turns off this drawing tool
    rectangle: true,
    marker: true
  },
  edit: {
    featureGroup: editableLayers, //REQUIRED!!
    remove: true
  }
};

var drawControl = new L.Control.Draw(drawOptions);
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === "marker") {
    layer
      .bindPopup(
        "LatLng: " + layer.getLatLng().lat + "," + layer.getLatLng().lng
      )
      .openPopup();
  }

  editableLayers.addLayer(layer);
  $(".drawercontainer .drawercontent").html(
    JSON.stringify(editableLayers.toGeoJSON())
  );
});

map.on(L.Draw.Event.EDITSTOP, function(e) {
  $(".drawercontainer .drawercontent").html(
    JSON.stringify(editableLayers.toGeoJSON())
  );
});

map.on(L.Draw.Event.DELETED, function(e) {
  $(".drawercontainer .drawercontent").html("");
});

//Edit Button Clicked
$('#toggledraw').click(function(e) {
  $(".leaflet-draw").fadeToggle("fast", "linear");
  $(".leaflet-draw-toolbar").fadeToggle("fast", "linear");
  this.blur();
  return false;
});

//Handle Map click to Display Lat/Lng
map.on('click', function(e) {
  $("#latlng").html(e.latlng.lat + ", " + e.latlng.lng);
    $("#latlng").show();
});

//Handle Copy Lat/Lng to clipboard
$('#latlng').click(function(e) {
  var $tempElement = $("<input>");
    $("body").append($tempElement);
    $tempElement.val($("#latlng").text()).select();
    document.execCommand("Copy");
    $tempElement.remove();
    alert("Copied: "+$("#latlng").text());
    $("#latlng").hide();
});

});
