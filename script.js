const API_KEY="6f3a5aa8273a4f69b1a100623242711"

const lat = 56.838011
const lon = 60.597474

let widgets = {}

String.prototype.format = function() {
    a = this;
    for (k in arguments) {
      a = a.replace("{" + k + "}", arguments[k])
    }
    return a
}

async function initMap(widget_number){
    await ymaps3.ready
    const {YMap, YMapDefaultSchemeLayer} = ymaps3;
    map = new YMap(
    document.getElementById('map' + widget_number),
    {
        location: {
            center: [lon, lat],
            zoom: 10
            }
        }
    );
    map.addChild(new YMapDefaultSchemeLayer());
    return map
}

function getWidgetNumberOfElem(elem) {
    while (elem.className != "mainMenu"){
        elem = elem.parentElement
    }
    let length = elem.id.length
    return elem.id.substring(8, length + 1)
}

function getWidgetOfElem(elem) {
    while (elem.className != "mainMenu"){
        elem = elem.parentElement
    }
    return elem
}

function updateCoordsFromMap(elem){
    let widget_number = getWidgetNumberOfElem(elem)
    let widget = getWidgetOfElem(elem)

    const map = widgets[widget_number].map
    
    const input_lat = widget.querySelector('#inputLatitude');
    const input_lon = widget.querySelector('#inputLongitude');

    input_lat.value = map.center[1]
    input_lon.value = map.center[0]
}

function updateCurrentConditionsDisplay(widget, json_response) {
    const temperature_display = widget.querySelector("#celsius")
    temperature_display.textContent = json_response.current.temp_c + " °C"
    const town_display = widget.querySelector("#town")
    town_display.textContent = "Town: " + json_response.location.country + ", " + json_response.location.name
    const icon_display = widget.querySelector("#icon")
    let icon_url = json_response.current.condition.icon
    icon_display.src = "https://" + icon_url.substring(2, icon_url.length + 1)
    const localtime_display = widget.querySelector("#localtime")
    localtime_display.textContent = "Local time: " + json_response.location.localtime
    const windforce_display = widget.querySelector("#windForce")
    windforce_display.textContent = "Wind speed: " + json_response.current.wind_kph + "km/h"
    const winddirection_display = widget.querySelector("#windDirection")
    winddirection_display.textContent = "Wind direction: " + json_response.current.wind_dir
    const atmosphericPressure_display = widget.querySelector("#atmosphericPressure")
    atmosphericPressure_display.textContent = "Atm pressure: " + Math.round(json_response.current.pressure_in * 25.4 * 100) / 100 + "mm"
}

async function widgetUpdate(elem) {
    let widget = getWidgetOfElem(elem)
    let widget_number = getWidgetNumberOfElem(elem)

    const latitude_input = widget.querySelector("#inputLatitude")
    const longitude_input = widget.querySelector("#inputLongitude")

    if (!(-90 <= latitude_input.value && latitude_input.value <= 90) | !latitude_input.value){
        alert("Incorrect coordinates! Latitude should be placed between -90 and 90 degrees"); return;
    }
    if (!(-180 <= longitude_input.value && longitude_input.value <= 180) | !longitude_input.value){
        alert("Incorrect coordinates! Longitude should be placed between -180 and 180 degrees"); return;
    }
    widgets[widget_number].map.update({location: {center:[longitude_input.value, latitude_input.value]}})
    
    let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude_input.value},${longitude_input.value}&aqi=no`)
    let json_response = await response.json()
    if (json_response.error && json_response.error.code == 1006) {
        alert("No nearest town was found for this coordinates so impossible to determine the weather here"); return;
    }

    updateCurrentConditionsDisplay(widget, json_response)    
}

async function addWidget() {
    const body = document.getElementById("body")
    const addWidgetBtn = document.getElementById("addWidget")

    let child = document.createElement("div");
    child.className = "mainMenu"
    let widget_number = Object.keys(widgets).length + 1;
    child.id = "mainMenu" + (widget_number)
    child.innerHTML = widgetHTML.format(widget_number)

    body.insertBefore(child, addWidgetBtn)

    map = await initMap(widget_number)

    widgets[widget_number] = {"div": child, "map": map}

    updateCoordsFromMap(child)
    widgetUpdate(child)
}

function removeWidget(elem) {
    let widget = getWidgetOfElem(elem)
    document.body.removeChild(widget)
}

const widgetHTML = `
    <img src="images/cross.webp" onclick="removeWidget(this)" class="removeButton">
    <div class="info">
        <div class="searchBox">
            <input placeholder="latitude" id="inputLatitude"></input>
        </div>
        <div class="searchBox">
            <input placeholder="longitude" id="inputLongitude"></input>
        </div>
        <div class="currentConditions">
            <p id="celsius" class="condition"></p>
            <p id="town" class="condition"></p>
            <img id="icon" src="" class="condition">
            <p id="localtime" class="condition"></p>
            <p id="windForce" class="condition"></p>
            <p id="windDirection" class="condition"></p>
            <p id="atmosphericPressure" class="condition"></p>
        </div>
        <div class="controls">
            <button onclick="widgetUpdate(this)">Get weather info</button>

            <button onclick="updateCoordsFromMap(this)">Use coordinates from map</button>
        </div>
    </div>
    <div class="map" id="map{0}"></div>`