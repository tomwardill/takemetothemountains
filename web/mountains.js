var mymap = L.map('mapid').setView([51.505, -0.09], 13);

var mountains;

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function locateMountain(latitude, longitude) {

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {

    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1); // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function getElevation(elevation) {
    if (elevation === null) {
      return 'unknown';
    }
    return elevation;
  }

  mountains.sort(function (a, b) {
    var aDistance = getDistanceFromLatLonInKm(latitude, longitude, a.decimal_latitude, a.decimal_longitude);
    a.distance = aDistance;
    var bDistance = getDistanceFromLatLonInKm(latitude, longitude, b.decimal_latitude, b.decimal_longitude);
    b.distance = bDistance;

    return ((aDistance < bDistance) ? -1 : ((aDistance > bDistance) ? 1 : 0));
  });

  var latlng = new L.LatLng(mountains[0].decimal_latitude, mountains[0].decimal_longitude)

  mymap.panTo(latlng);

  var popup = L.popup()
    .setLatLng(latlng)
    .setContent(mountains[0].title + " - " + getElevation(mountains[0].elevation) + "m - " + Math.round(mountains[0].distance) + "km")
    .openOn(mymap);

  $('#listDistances').empty();

  for (var i = 0; i < 10; i++) {
    $('#listDistances').append('<li><a href="https://en.wikipedia.org/wiki/' + mountains[i].url + '">' + mountains[i].title + " - " + getElevation(mountains[i].elevation) + " metres - " + Math.round(mountains[i].distance) + "km" + '</li>');
  }
}


L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  accessToken: 'pk.eyJ1IjoidG9td2FyZGlsbCIsImEiOiJhQjJ4UmlJIn0.RVukKBwAuZ1utNX_g9kjcg'
}).addTo(mymap);


var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
  .on('markgeocode', function (e) {
    locateMountain(e.geocode.center.lat, e.geocode.center.lng);
  })
  .addTo(mymap);


$.getJSON("items.json", function (json) {
  mountains = json;

  navigator.geolocation.getCurrentPosition(
    function (position) {
      locateMountain(position.coords.latitude, position.coords.longitude);
    },
    function (error) {
      console.log(error);
    },
    {timeout: 10000});
});
