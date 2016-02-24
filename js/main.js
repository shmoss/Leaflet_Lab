


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

/*function createPropSymbols(data, map){
	var attribute = "2013";
	var geojsonMarkerOptions = {
    	radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
        };
*/
//radius function

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
  };

//end radius function
		
		//we'll create a Leaflet GeoJSON layer and add it to map, taking "response" data as parameter
			/*L.geoJson(data, {
				//create a layer from original geojson points
				pointToLayer: function(feature, latlng){
					 //For each feature, determine its value for the selected attribute
					var attValue = Number(feature.properties[attribute]);
					
					  //Step 6: Give each feature's circle marker a radius based on its attribute value
            		geojsonMarkerOptions.radius = calcPropRadius(attValue);
					
					//examine the attribute value to check that it is correct
            		console.log(feature.properties, attValue);
            		
					//circle markers
					return L.circleMarker(latlng, geojsonMarkerOptions);
				}
			//now, we need to add the circle layer to the map
			}).addTo(map);
		};	
		*/

//function to convert markers to circle markers
function pointToLayer(feature, latlng){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "2013";

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>City:</b> " + feature.properties.City + "</p>";
    
    //add formatted attribute to popup content string
    var year = attribute.split("_")[0];
    popupContent += "<p><b>Crime Rate in " + year + ":</b> " + feature.properties[attribute] + " homicides per 100,000 people</p>";

    //bind the popup to the circle marker
     //Example 2.5 line 1...bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        },
        click: function(){
            $("#panel").html(popupContent);
        }
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, map){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: pointToLayer
    }).addTo(map);
};		

		
//Step 2: Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/CrimeRates.geojson", {
        dataType: "json",
        success: function(response){
            //call function to create proportional symbols
            createPropSymbols(response, map);
        }
		
	});
}


//way at the bottom- we call the create map function once the doc has loaded.

$(document).ready(createMap);



