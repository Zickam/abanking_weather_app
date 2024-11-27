

const API_KEY="6f3a5aa8273a4f69b1a100623242711"

let lat = 56.838011
let lon = 60.597474

var map;

initMap()

async function initMap(){
    await ymaps3.ready
    const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    map = new YMap(
    document.getElementById('map'),
    {
        location: {
            center: [lon, lat],
            zoom: 10
            }
        }
    );
    map.addChild(new YMapDefaultSchemeLayer());
    updateCoordsFromMap()
}

function updateCoordsFromMap(){
    lat = map.center[1]
    lon = map.center[0]
    
    document.getElementById("inputLatitude").value = lat
    document.getElementById("inputLongitude").value = lon
}

async function update() {
    const latitude_input = document.getElementById("inputLatitude").value
    const longitude_input = document.getElementById("inputLongitude").value
    
    console.log(map)
    map.update({location: {center:[longitude_input, latitude_input] }})
    console.log(map)

    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude_input},${longitude_input}&aqi=no`
    
    let response = await fetch(url)
    let json_response = await response.json()

    console.log("API response:", json_response)

    if (json_response.error && json_response.error.code == 1006) {
        alert("Incorrect coordinates specified")
    }

    const temperature_display = document.getElementById("celsius")
    temperature_display.textContent = json_response.current.temp_c + " °C"
    const town_display = document.getElementById("town")
    town_display.textContent = "Town: " + json_response.location.name
    
}