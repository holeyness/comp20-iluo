function init() {
     var mapOptions = {
     center: new google.maps.LatLng(42.404986, -71.119283),
     zoom: 13
     
     };
     
     var map = new google.maps.Map(document.getElementById("canvas"),
            mapOptions);
            
            
     //find me
    if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'Location found using HTML5.'
      });

      map.setCenter(pos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}