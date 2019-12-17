var pub = 0;
window.onload = function () {
    var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	});

    $.getJSON("geo_2000.geojson", function(data) {

//     var geojson = L.geoJson(data, {
//       onEachFeature: function (feature, layer) {
//          layer.bindPopup(feature.properties.Area_Name + '<p><b> 2001 Population: ' + feature.properties.Pop_2001 + '</b></p>' + '<p><b> 1981 Population: ' + feature.properties.Pop_1981 + '</b></p>' + '<p><b> 1801 Population ' + feature.properties.Pop_1801 + '</b></p>');


    var geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.NAME + "<p><b>" + feature.properties.P003005 + "</b></p>");
        console.log("here")
        pub = feature;
      }
    });


    var map = L.map('my-map')
    .fitBounds(geojson.getBounds());

    basemap.addTo(map);
    geojson.addTo(map);
  });
console.log("does this run")
};
