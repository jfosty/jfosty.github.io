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
    d3.csv("Static/data/Philadelphia_Food_Access2.csv").then(csvData => {

        // Create a lookup for faster access
        let censusLookup = {};
        csvData.forEach(row => {
            censusLookup[row["Census Tract"]] = row;

        });

        // Add the GeoJSON layer with data matching
        L.geoJson(geojsonData, {
            style: function (feature) {
                let tractID = feature.properties["GEOID10"];
                let data = censusLookup[tractID];

                if (data) {
                    let snap = +data["Snap Percentage"];
                    //let lowAccess1 = +data["LA - 1 mile radius"];
                
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: getColor(snap), // Use CSV data
                        fillOpacity: 0.4
                    };
                 } else {
                    return {
                        color: "black",
                        weight: 1,
                        fillColor: "gray", // Default color
                        fillOpacity: 0.4
                    };
                }
            },
            onEachFeature: function (feature, layer) {
                let tractID = feature.properties["GEOID10"];
                let data = censusLookup[tractID];
                // Add content to pop-ups
                let popupContent = `<b>Census Tract:</b> ${tractID}<br>`;// Should we put Zip Code instead?
                if (data) {
                    let snapnum = data["Total Count of Housing w/ Snap Benefits"] > "0" ? "Snap Users" : "No Snap users";

                    popupContent += `<b>Snap Percentage:</b> ${data["Snap Percentage"]}<br>`;// What else should we include in pop-ups
                    popupContent += `<b>Status:</b> ${snapnum}<br>`;
                    popupContent += `<b>Median Income: </b> $${data["Median Family Income"]}<br>`;
                } else {
                    popupContent += "No data available";
                }

                layer.bindPopup(popupContent);
            }
        }).addTo(PhillyMap);

    }).catch(error => console.log("Error loading CSV:", error));
}).catch(error => console.log("Error loading GeoJSON:", error));

// Here we can adjust the colors that indicate food deserts and how far it is to grocery store, etc.
function getColor(snap) {
    if (snap > 0 && snap <= 10) {
        return "green";
    } else if (snap > 10 && snap <= 40) {
        return "yellow";
    } else if (snap > 40 && snap < 100) {
        return "red"
    } else {
        return "gray";
    }
    // return value[0] == 1 ? "red" :
    //        value[1] == 0 ? "green" :
    //        value[1] == 1 ? "yellow" :
    //                       "gray";
}
