// Create the tile layer for the map background
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Create map of Philadelphia with layers
let PhillyMap = L.map("map", {
    center: [39.95, -75.16],
    zoom: 13
});

// Add streetmap tile layer to the map
streetmap.addTo(PhillyMap);


// Load GeoJSON data first
let link = "https://opendata.arcgis.com/datasets/8bc0786524a4486bb3cf0f9862ad0fbf_0.geojson"
d3.json(link).then(geojsonData => {
    
    // Load the CSV data - Note: I had to run a server in the project folder in order to view the CSV data
    // In a terminal window run: python -m http.server 8000
    d3.csv("http://localhost:8000/static/data/FarmersMarketClean").then(csvData => {
       
  //console.log(response);
  features = response.features;

  //console.log(features);

  // Comment this line in to render all 80,000 markers
  // let marker_limit = features.length;
  let marker_limit = 1000;

  for (let i = 0; i < marker_limit; i++) {

    let location = features[i].geometry;
    if(location){
      L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
    }

  }
    })
})