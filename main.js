//get user location by ip
var ip = 'http://ip-api.com/json';

var map = L.map('map').setView([51.505, -0.09], 13);
//get user location by ip
fetch(ip)
    .then(response => response.json())
    .then(data => {
        //set the map view to user location
        map.setView([data.lat, data.lon], 10);
        //add marker to user location
        L.marker([data.lat, data.lon]).addTo(map)
            .bindPopup('Your location')
    });
//add tile layer to the map
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'tunmenee 2023 - ∞ (Default is Lat, Lng)'
}).addTo(map);
// add a toolbar to the map that lets draw a bounding box
var drawnItems = new L.FeatureGroup();
var container = new L.FeatureGroup();
map.addLayer(container);
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    //allow only rectangle to be drawn black
    draw: {
        polyline: false,
        polygon: false,
        circle: false,
        marker: false,
        rectangle: {
            shapeOptions: {
                color: 'black',
                weight: 2,
                fillOpacity: 0.1,
                //set title
                title: 'Draw a rectangle',

            }
        },
    },
    edit: {
        featureGroup: drawnItems,
        
    }

});


map.addControl(drawControl);


// add event to the draw:created event
map.on('draw:created', function (e) {
    // add the created rectangle to the map
    drawnItems.addLayer(e.layer);
    //call async function to draw container rectangle
    drawContainerRectangle(e.layer);
    //move the map to the center of the container rectangle
    
});
// add event to the draw:edited event
map.on('draw:edited draw:deleted', function (e) {
    //call async function to draw container rectangle
    drawContainerRectangle(e.layer);
});

//on cursor move set div with id "center" to cursor coordinates
map.on('mousemove', function (e) {
    //strip to 6 decimal places
    //print lat and lng
    if (order == 0) {
        document.getElementById("pointer").innerHTML = e.latlng.lat.toFixed(6) + ", " + e.latlng.lng.toFixed(6);
    }
    else {
        //lng and lat are switched
        document.getElementById("pointer").innerHTML = e.latlng.lng.toFixed(6) + ", " + e.latlng.lat.toFixed(6);
    }
});
map.on('move zoomend', function (e) {
    //strip to 6 decimal places
    //print lat and lng
    if (order == 0) {
        document.getElementById("cntr").innerHTML = map.getCenter().lat.toFixed(6) + ", " + map.getCenter().lng.toFixed(6);
    }
    else {
        //lng and lat are switched
        document.getElementById("cntr").innerHTML = map.getCenter().lng.toFixed(6) + ", " + map.getCenter().lat.toFixed(6);
    }
});







let order = 0;

// async function to draw container rectangle
async function drawContainerRectangle(layer) {
    //get the bounds of drawn layer
    var bounds = drawnItems.getBounds();
    //check if container rectangle is already drawn
    if (container.getLayers().length > 0) {
        //remove the container rectangle
        container.clearLayers();
    }
    //if there is no drawn object hide the popup
    if (drawnItems.getLayers().length == 0) {
        document.getElementById("popup").style.display = "none";
    }
    //draw the container rectangle
    var containerRectangle = L.rectangle(bounds, {
        color: 'red',
        weight: 3,
        fillOpacity: 0,
        title: 'Container rectangle',
        //disable all mouse events
        interactive: false
    });
    container.addLayer(containerRectangle);
    //set display: inline-block to the  div
    document.getElementById("popup").style.display = "inline-block";
    //print out lat and lng of the container rectangle to div with id "popup"
    //strip to 6 decimal places
    //print north west and south east coordinates
    if (order == 0) {
    document.getElementById("popup").innerHTML = bounds.getNorthWest().lat.toFixed(6) + ", " + bounds.getNorthWest().lng.toFixed(6) + "<br>" + bounds.getSouthEast().lat.toFixed(6) + ", " + bounds.getSouthEast().lng.toFixed(6);
    }
    else {
        //lng and lat are switched
        document.getElementById("popup").innerHTML = bounds.getNorthWest().lng.toFixed(6) + ", " + bounds.getNorthWest().lat.toFixed(6) + "<br>" + bounds.getSouthEast().lng.toFixed(6) + ", " + bounds.getSouthEast().lat.toFixed(6);
    }
    map.fitBounds(bounds);
}

map.attributionControl.setPrefix(false);

function removeAll() {
    //reset the map by removing all objects
    drawnItems.clearLayers();
    container.clearLayers();
    document.getElementById("popup").style.display = "none";

}

function switchlatlng() {
    //switch the order of lat and lng
    if (order == 0) {
        order = 1;
    }
    else {
        order = 0;
    }
    //call async function to draw container rectangle
    drawContainerRectangle();
    //call function to get center of map
    map.fire('move');
    //call function to get cursor coordinates
    map.fire('mousemove');
}