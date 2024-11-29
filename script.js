

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
    const latitude_input = document.getElementById("inputLatitude")
    const longitude_input = document.getElementById("inputLongitude")
    const latitude = latitude_input.value
    const longitude = longitude_input.value

    if (!(-90 <= latitude && latitude <= 90) | !latitude){
        alert("Incorrect coordinates! Latitude should be placed between -90 and 90 degrees")
        return
    }
    if (!(-180 <= longitude && longitude <= 180) | !longitude){
        alert("Incorrect coordinates! Longitude should be placed between -180 and 180 degrees")
        return
    }
    
    map.update({location: {center:[longitude, latitude] }})

    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}&aqi=no`
    
    let response = await fetch(url)
    let json_response = await response.json()

    console.log("API response:", json_response)

    if (json_response.error && json_response.error.code == 1006) {
        alert("No nearest town was found for this coordinates so impossible to determine the weather here")
    }

    const temperature_display = document.getElementById("celsius")
    temperature_display.textContent = json_response.current.temp_c + " °C"
    const town_display = document.getElementById("town")
    town_display.textContent = "Town: " + json_response.location.country + ", " + json_response.location.name
    const icon_display = document.getElementById("icon")
    icon_display.src = json_response.current.condition.icon
    const localtime_display = document.getElementById("localtime")
    localtime_display.textContent = "Local time: " + json_response.location.localtime
    const windforce_display = document.getElementById("windForce")
    windforce_display.textContent = "Wind speed: " + json_response.current.wind_kph + "km/h"
    const winddirection_display = document.getElementById("windDirection")
    winddirection_display.textContent = "Wind direction: " + json_response.current.wind_dir
}