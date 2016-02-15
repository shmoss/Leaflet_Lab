


//Map of GeoJSON data from CrimeRates.geojson 

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('map', {
    	//set geographic center
        center: [38, -87],
        //set initial zoom level
        zoom: 4
    });


//add OSM base tilelayer
    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);

getData(map);

};

function getData(map){
	//ajax function to get MegaCities data layer loaded into map
	$.ajax("data/CrimeRates.geojson", {
		//datatype specified
		dataType: "json",
		//upon success, call the following function
		success: function(response){
			//Let's set options for the geojson markers.  Note the object notation.
			  var geojsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
			
		//we'll create a Leaflet GeoJSON layer and add it to map, taking "response" data as parameter
			L.geoJson(response, {
				//create a layer from original geojson points
				pointToLayer: function(feature, latlng){
					//instead of markers, we want circles, so we return the geojsonMarkerOptions function with circle specs
					return L.circleMarker(latlng, geojsonMarkerOptions);
				}
			//now, we need to add the circle layer to the map
			}).addTo(map);
		}	
	});
}

//way at the bottom- we call the create map function once the doc has loaded.
$(document).ready(createMap);


