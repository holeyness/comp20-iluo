var map;
var mypos;
var lat = 0;
var long = 0;
var mystation;
var xhr;
var myline = "white";
var result;
var mylinestations;
var posmarker;
var distance;
var stationinfo;
var inbound;
var outbound;
var braintree;

function init() {
     var mapOptions = {
     center: new google.maps.LatLng(42.404986, -71.119283),
     zoom: 13
     
     };
     
     map = new google.maps.Map(document.getElementById("canvas"),
            mapOptions);
            
            
     //find me

     downloadData();
}

function downloadData(){
	xhr = new XMLHttpRequest;
	xhr.open("get", "http://mbtamap.herokuapp.com/mapper/rodeo.json", true);
	xhr.send(null);
	//ERROR HANDLING
	
	xhr.onreadystatechange = function (){
		if (xhr.readyState == 4){
			if (xhr.status == 200){
				result = JSON.parse(xhr.response);
				myline = result.line;
				console.log(myline);
				findme(closestStation);
			} else if (xhr.status == 500){
				downloadData();	//repeat function if status is 500
				return;
			}
		}
	}
}


function findme(callback){
	 if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      mypos = new google.maps.LatLng(position.coords.latitude,
                                       position.coords.longitude);
    lat = mypos["k"];

    long = mypos["A"];

    
    setTimeout(function(){callback();}, 10000);
    
    
    posmarker = new google.maps.Marker({
    position: mypos,
    map: map,
    title:"Your Location"

	})
      map.setCenter(mypos);
    }, function() {
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleNoGeolocation(false);
  }
}


function closestStation(){
    distance = 10000;
	var stationname;
	
	if (myline == "red"){
		for (i=0; i<redstations.length; i++){
			var dist = calculate(redstations[i].Lat,redstations[i].Long,lat,long);
			if (dist < distance){
				stationname = redstations[i].Station;
				distance = dist;
			}
		}
	} else if (myline == "blue"){
		for (i=0; i<bluestations.length; i++){
			var dist = calculate(bluestations[i].Lat,bluestations[i].Long,lat,long);
			if (dist < distance){
				stationname = bluestations[i].Station;
				distance = dist;
			}
		}
	} else if (myline == "orange"){
		for (i=0; i<orangestations.length; i++){
			var dist = calculate(orangestations[i].Lat,orangestations[i].Long,lat,long);
			if (dist < distance){
				stationname = orangestations[i].Station;
				distance = dist;
			}
		}	
	}
	mystation = stationname;
	drawStations();
	mywindow();	
	
}
//helper function
function toRad(x){
		 return x * Math.PI / 180;
}

function trains(station){	//returns an array with a list of times inbound
	inbound = new Array();
	outbound = new Array();
	if (myline == "red"){
		braintree = new Array();
		for (var a = 0; a<result.schedule.length; a++){	//bowdoin
			if (result.schedule[a].Destination == "Ashmont"){	
				for (var b = 0; b<result.schedule[a].Predictions.length; b++){
					if (result.schedule[a].Predictions[b].Stop == station){
						inbound.push(result.schedule[a].Predictions[b].Seconds);
					}
				}
			} else if (result.schedule[a].Destination == "Alewife"){
				for (var c = 0; c<result.schedule[a].Predictions.length; c++){
					if (result.schedule[a].Predictions[c].Stop == station){
						outbound.push(result.schedule[a].Predictions[c].Seconds);
					}
				}
				
			} else if (result.schedule[a].Destination == "Braintree"){
				for (var d = 0; d<result.schedule[a].Predictions.length; d++){
					if (result.schedule[a].Predictions[d].Stop == station){
						braintree.push(result.schedule[a].Predictions[d].Seconds);
					}
				}			
			}
		}		
	} else if (myline == "blue"){
		for (var i = 0; i<result.schedule.length; i++){	//bowdoin
			if (result.schedule[i].Destination == "Bowdoin"){
				for (j = 0; j<result.schedule[i].Predictions.length; j++){
					if (result.schedule[i].Predictions[j].Stop == station){
						inbound.push(result.schedule[i].Predictions[j].Seconds);
					}
				}
			} else if (result.schedule[i].Destination == "Wonderland"){	//wonderland
				for (j = 0; j<result.schedule[i].Predictions.length; j++){
					if (result.schedule[i].Predictions[j].Stop == station){
						outbound.push(result.schedule[i].Predictions[j].Seconds);
					}
				}
				
			}
		}
	} else if (myline == "orange"){		
		for (var i = 0; i<result.schedule.length; i++){	//forest hills
			if (result.schedule[i].Destination == "Forest Hills"){
				for (j = 0; j<result.schedule[i].Predictions.length; j++){
					if (result.schedule[i].Predictions[j].Stop == station){
						inbound.push(result.schedule[i].Predictions[j].Seconds);
					}
				}
			} else if (result.schedule[i].Destination == "Oak Grove"){	//Oak Grove
				for (j = 0; j<result.schedule[i].Predictions.length; j++){
					if (result.schedule[i].Predictions[j].Stop == station){
						outbound.push(result.schedule[i].Predictions[j].Seconds);
					}
				}
				
			}
		}
	}
		
}
function traintimes(array){
	var resultschedule;
	for (i=0; i < array.length; i++ ){
		var minutes = Math.floor(array[i]/60);
		var seconds = array[i]%60;
		if (seconds < 10){
			seconds = '0'+seconds;
		}
		resultschedule = resultschedule + '<p id = times>' + minutes + ':' + seconds +'</p>';
	}
	return resultschedule;
}

function drawStations(){
	if (myline == "blue"){

		for (var i = 0; i < bluestations.length; i++){
			var image = 'marker.png';
			trains(bluestations[i].Station);	//order the array
			var inboundtime = traintimes(inbound);
			var outboundtime = traintimes(outbound);
			var stationcontent = '<div id = "title">'+'<h3>Station: '+ bluestations[i].Station +'</h3>'+'</div>'+'<div id="inbound">'+ inboundtime + '</div>' + '<div id = "outbound">'+ outboundtime + '</div>';
			var myLatLng = new google.maps.LatLng(bluestations[i].Lat, bluestations[i].Long);
			var stationMarker = new google.maps.Marker({
				position: myLatLng,
				map:map,
				icon: image,
			});
			
			var stationinfo = new google.maps.InfoWindow({
				content: stationcontent
			});
			
			google.maps.event.addListener(stationMarker, 'click', (function(stationMarker, 												stationcontent, stationinfo){
				return function(){
					stationinfo.setContent(stationcontent);
					stationinfo.open(map, stationMarker);
				};
				
			})(stationMarker, stationcontent, stationinfo));
		}	
	
	} else if (myline == "red"){
		for (var i = 0; i < redstations.length; i++){
			var image = 'marker.png';
			var stationcontent;
			var stationinfo = new google.maps.InfoWindow({
				content: "Hello"
			});
			var myLatLng = new google.maps.LatLng(redstations[i].Lat, redstations[i].Long);
			var stationMarker = new google.maps.Marker({
				position: myLatLng,
				map:map,
				icon: image,
				infowindow: stationinfo
			});
			
			google.maps.event.addListener(stationMarker, 'click', function(){
				this.infowindow.open(map, stationMarker)
			});
			
			//trains(redstations[i].Station);
		   //var inboundtime = traintimes(inbound);
			//var outboundtime = traintimes(outbound);
			
			//console.log(inboundtime);
			//console.log(outboundtime);
		   // stationcontent = '<div id = "title">'+'<h3>Station: '+ bluestations[i].Station +'</h3>'+'</div>'+'<div id="inbound">'+ inboundtime + '</div>' + '<div id = "outbound">'+ outboundtime + '</div>';

			
		}
	} else if (myline == "orange"){
		for (var i = 0; i < orangestations.length; i++){
			var image = 'marker.png';
			
		//	trains(orangestations[i].Station)
			//var stationcontent;
			
			var stationinfo = new google.maps.InfoWindow({
				content: "HELLO"
			});
			
			var myLatLng = new google.maps.LatLng(orangestations[i].Lat, orangestations[i].Long);
			var stationMarker = new google.maps.Marker({
				position: myLatLng,
				map:map,
				icon: image,
				infowindow: stationinfo
			});
			
			google.maps.event.addListener(stationMarker, 'click', function(){
				this.infowindow.open(map, this)
			});
		}
	}
	drawLines();	

}

function mywindow(){
	var mycontent = '<div id = "title">'+'<h3>You are here</h3>'+'</div>'+'<div id ="text">'+'<p>Location: '+lat+', '+long+'</p>'+'<p>Closest Station: '+mystation+'</p>'+'<p>Distance: '+ Math.floor(distance*100)/100 +' miles' + '</p>'+'</div>';
	
	var info = new google.maps.InfoWindow({
		content: mycontent
	});
	info.open(map,posmarker);
}

function drawLines(){
	if (myline == "blue"){
		var blueCoord = [];
		for (var i = 0; i < bluestations.length; i++){
			blueCoord.push(new google.maps.LatLng(bluestations[i].Lat, bluestations[i].Long));
		}
		var path = new google.maps.Polyline({
			path: blueCoord,
			geodesic: true,
			strokeColor: '#0000FF',
			strokeOpacity: 1.0,
			strokeWeight: 2		
		});
		path.setMap(map);
	} else if (myline == "red"){
		var redCoord = [];
		for (var i = 0; i < redstations.length; i++){
			redCoord.push(new google.maps.LatLng(redstations[i].Lat, redstations[i].Long));
		}
		var path = new google.maps.Polyline({
			path: redCoord,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2		
		});
		path.setMap(map);
	} else if (myline == "orange"){
		var orangeCoord = [];
		for (var i = 0; i < orangestations.length; i++){
			orangeCoord.push(new google.maps.LatLng(orangestations[i].Lat, orangestations[i].Long));
		}
		var path = new google.maps.Polyline({
			path: orangeCoord,
			geodesic: true,
			strokeColor: '#FF6600',
			strokeOpacity: 1.0,
			strokeWeight: 2		
		});
		path.setMap(map);	
	}
}
	
function calculate(lat1,lon1,lat2,lon2){
	var R = 6371; // km

	var dLat = toRad((lat2-lat1));
	var dLon = toRad((lon2-lon1));
	var lat1 = toRad(lat1);
	var lat2 = toRad(lat2);

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c * 0.6213;
		
	return d;	//miles
	
}


//STATIONS DATA
var bluestations = 
[{"Station":"Bowdoin","Lat":42.361365,"Long":-71.062037},
{"Station":"Government Center","Lat":42.359705,"Long":-71.059215},
{"Station":"State Street","Lat":42.358978,"Long":-71.057598},
{"Station":"Aquarium","Lat":42.359784,"Long":-71.051652},
{"Station":"Maverick","Lat":42.36911856,"Long":-71.03952958},
{"Station":"Airport","Lat":42.374262,"Long":-71.030395},
{"Station":"Wood Island","Lat":42.3796403,"Long":-71.02286539},
{"Station":"Orient Heights","Lat":42.386867,"Long":-71.004736},
{"Station":"Suffolk Downs","Lat":42.39050067,"Long":-70.99712259},
{"Station":"Beachmont","Lat":42.39754234,"Long":-70.99231944},
{"Station":"Revere Beach","Lat":42.40784254,"Long":-70.99253321},
{"Station":"Wonderland","Lat":42.41342,"Long":-70.991648}];

var orangestations =
[{"Station":"Oak Grove","Lat":42.43668,"Long":-71.071097},
{"Station":"Malden Center","Lat":42.426632,"Long":-71.07411},
{"Station":"Wellington","Lat":42.40237,"Long":-71.077082},
{"Station":"Sullivan","Lat":42.383975,"Long":-71.076994},
{"Station":"Community College","Lat":42.373622,"Long":-71.069533},
{"Station":"North Station","Lat":42.365577,"Long":-71.06129},
{"Station":"Haymarket","Lat":42.363021,"Long":-71.05829},
{"Station":"State Street","Lat":42.358978,"Long":-71.057598},
{"Station":"Downtown Crossing","Lat":42.355518,"Long":-71.060225},
{"Station":"Chinatown","Lat":42.352547,"Long":-71.062752},
{"Station":"Tufts Medical","Lat":42.349662,"Long":-71.063917},
{"Station":"Back Bay","Lat":42.34735,"Long":-71.075727},
{"Station":"Mass Ave","Lat":42.341512,"Long":-71.083423},
{"Station":"Ruggles","Lat":42.336377,"Long":-71.088961},
{"Station":"Roxbury Crossing","Lat":42.331397,"Long":-71.095451},
{"Station":"Jackson Square","Lat":42.323132,"Long":-71.099592},
{"Station":"Stony Brook","Lat":42.317062,"Long":-71.104248},
{"Station":"Green Street","Lat":42.310525,"Long":-71.107414},
{"Station":"Forest Hills","Lat":42.300523,"Long":-71.113686}];

var redstations = 
[{"Station":"Alewife","Lat":42.395428,"Long":-71.142483},
{"Station":"Davis","Lat":42.39674,"Long":-71.121815},
{"Station":"Porter Square","Lat":42.3884,"Long":-71.119149},
{"Station":"Harvard Square","Lat":42.373362,"Long":-71.118956},
{"Station":"Central Square","Lat":42.365486,"Long":-71.103802},
{"Station":"Kendall/MIT","Lat":42.36249079,"Long":-71.08617653},
{"Station":"Charles/MGH","Lat":42.361166,"Long":-71.070628},
{"Station":"Park Street","Lat":42.35639457,"Long":-71.0624242},
{"Station":"Downtown Crossing","Lat":42.355518,"Long":-71.060225},
{"Station":"South Station","Lat":42.352271,"Long":-71.055242},
{"Station":"Broadway","Lat":42.342622,"Long":-71.056967},
{"Station":"Andrew","Lat":42.330154,"Long":-71.057655},
{"Station":"JFK/UMass","Lat":42.320685,"Long":-71.052391},
{"Station":"Savin Hill","Lat":42.31129,"Long":-71.053331},
{"Station":"Fields Corner","Lat":42.300093,"Long":-71.061667},
{"Station":"Shawmut","Lat":42.29312583,"Long":-71.06573796},
{"Station":"Ashmont","Lat":42.284652,"Long":-71.064489},
{"Station":"North Quincy","Lat":42.275275,"Long":-71.029583},
{"Station":"Wollaston","Lat":42.2665139,"Long":-71.0203369},
{"Station":"Quincy Center","Lat":42.251809,"Long":-71.005409},
{"Station":"Quincy Adams","Lat":42.233391,"Long":-71.007153},
{"Station":"Braintree","Lat":42.2078543,"Long":-71.0011385}];

var stations =
[{"Color":"Blue","Station":"Airport","Lat":42.374262,"Long":-71.030395},
{"Color":"Blue","Station":"Aquarium","Lat":42.359784,"Long":-71.051652},
{"Color":"Blue","Station":"Beachmont","Lat":42.39754234,"Long":-70.99231944},
{"Color":"Blue","Station":"Bowdoin","Lat":42.361365,"Long":-71.062037},
{"Color":"Blue","Station":"Government Center","Lat":42.359705,"Long":-71.059215},
{"Color":"Blue","Station":"Maverick","Lat":42.36911856,"Long":-71.03952958},
{"Color":"Blue","Station":"Orient Heights","Lat":42.386867,"Long":-71.004736},
{"Color":"Blue","Station":"Revere Beach","Lat":42.40784254,"Long":-70.99253321},
{"Color":"Blue","Station":"State Street","Lat":42.358978,"Long":-71.057598},
{"Color":"Blue","Station":"Suffolk Downs","Lat":42.39050067,"Long":-70.99712259},
{"Color":"Blue","Station":"Wonderland","Lat":42.41342,"Long":-70.991648},
{"Color":"Blue","Station":"Wood Island","Lat":42.3796403,"Long":-71.02286539},
{"Color":"Orange","Station":"Back Bay","Lat":42.34735,"Long":-71.075727},
{"Color":"Orange","Station":"Chinatown","Lat":42.352547,"Long":-71.062752},
{"Color":"Orange","Station":"Community College","Lat":42.373622,"Long":-71.069533},
{"Color":"Orange","Station":"Downtown Crossing","Lat":42.355518,"Long":-71.060225},
{"Color":"Orange","Station":"Forest Hills","Lat":42.300523,"Long":-71.113686},
{"Color":"Orange","Station":"Green Street","Lat":42.310525,"Long":-71.107414},
{"Color":"Orange","Station":"Haymarket","Lat":42.363021,"Long":-71.05829},
{"Color":"Orange","Station":"Jackson Square","Lat":42.323132,"Long":-71.099592},
{"Color":"Orange","Station":"Malden Center","Lat":42.426632,"Long":-71.07411},
{"Color":"Orange","Station":"Mass Ave","Lat":42.341512,"Long":-71.083423},
{"Color":"Orange","Station":"North Station","Lat":42.365577,"Long":-71.06129},
{"Color":"Orange","Station":"Oak Grove","Lat":42.43668,"Long":-71.071097},
{"Color":"Orange","Station":"Roxbury Crossing","Lat":42.331397,"Long":-71.095451},
{"Color":"Orange","Station":"Ruggles","Lat":42.336377,"Long":-71.088961},
{"Color":"Orange","Station":"State Street","Lat":42.358978,"Long":-71.057598},
{"Color":"Orange","Station":"Stony Brook","Lat":42.317062,"Long":-71.104248},
{"Color":"Orange","Station":"Sullivan","Lat":42.383975,"Long":-71.076994},
{"Color":"Orange","Station":"Tufts Medical","Lat":42.349662,"Long":-71.063917},
{"Color":"Orange","Station":"Wellington","Lat":42.40237,"Long":-71.077082},
{"Color":"Red","Station":"Alewife","Lat":42.395428,"Long":-71.142483},
{"Color":"Red","Station":"Andrew","Lat":42.330154,"Long":-71.057655},
{"Color":"Red","Station":"Ashmont","Lat":42.284652,"Long":-71.064489},
{"Color":"Red","Station":"Braintree","Lat":42.2078543,"Long":-71.0011385},
{"Color":"Red","Station":"Broadway","Lat":42.342622,"Long":-71.056967},
{"Color":"Red","Station":"Central Square","Lat":42.365486,"Long":-71.103802},
{"Color":"Red","Station":"Charles/MGH","Lat":42.361166,"Long":-71.070628},
{"Color":"Red","Station":"Davis","Lat":42.39674,"Long":-71.121815},
{"Color":"Red","Station":"Downtown Crossing","Lat":42.355518,"Long":-71.060225},
{"Color":"Red","Station":"Fields Corner","Lat":42.300093,"Long":-71.061667},
{"Color":"Red","Station":"Harvard Square","Lat":42.373362,"Long":-71.118956},
{"Color":"Red","Station":"JFK/UMass","Lat":42.320685,"Long":-71.052391},
{"Color":"Red","Station":"Kendall/MIT","Lat":42.36249079,"Long":-71.08617653},
{"Color":"Red","Station":"North Quincy","Lat":42.275275,"Long":-71.029583},
{"Color":"Red","Station":"Park Street","Lat":42.35639457,"Long":-71.0624242},
{"Color":"Red","Station":"Porter Square","Lat":42.3884,"Long":-71.119149},
{"Color":"Red","Station":"Quincy Adams","Lat":42.233391,"Long":-71.007153},
{"Color":"Red","Station":"Quincy Center","Lat":42.251809,"Long":-71.005409},
{"Color":"Red","Station":"Savin Hill","Lat":42.31129,"Long":-71.053331},
{"Color":"Red","Station":"Shawmut","Lat":42.29312583,"Long":-71.06573796},
{"Color":"Red","Station":"South Station","Lat":42.352271,"Long":-71.055242},
{"Color":"Red","Station":"Wollaston","Lat":42.2665139,"Long":-71.0203369}];