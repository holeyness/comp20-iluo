function init(){

	var mapcanvas = {
		center:new google.maps.LatLng(42.404796, -71.119884),
		zoom:5,
		mapTypeId:google.maps.MapTypeId.ROADMAP
		};
 
	var map=new google.maps.Map(document.getElementById("canvas"),mapcanvas);
}

function stations(){

	stations = new Array();
	
}