var map;

function init() {
     var mapOptions = {
     center: new google.maps.LatLng(42.404986, -71.119283),
     zoom: 13
     
     };
     
     map = new google.maps.Map(document.getElementById("canvas"),
            mapOptions);
            
            
     //find me
     findme();
}

function findme(){
	 if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);

      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        
        
        content: '!!!!'
      });
      
      
    var posmarker = new google.maps.Marker({
    position: pos,
    map: map,
    title:"Your Location"
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