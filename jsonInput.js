function Clamp(val, minVal, maxVal) {
    // Converts values between 0 and 1 so that chartcss can use them
    // By changing min and max, you can examine values more closely within their range
    return (val - minVal) / (maxVal - minVal);
}

function CreateBar(data, clampedData, targetID, r, g, b ,a) {
    newBar = document.createElement("td")
    newBar.className = "dataBar"
    newBar.style.setProperty("--size", clampedData) // --size is the height of the bar and must be between 0 and 1
    newBar.style.setProperty("background-color", "rgba" + "(" +
    (r * clampedData) + "," + 
    (g * clampedData) + "," + 
    (b * clampedData) + "," + 
    (a * clampedData) + ")");

    tooltip = document.createElement("span");
    tooltip.className = "tooltip";
    tooltip.innerHTML = data;
    newBar.appendChild(tooltip);

    document.getElementById(targetID).appendChild(newBar)
}

function DeleteBar(targetID) {
    while (document.getElementById(targetID).lastElementChild.nodeName == "TD") {
        document.getElementById(targetID).lastElementChild.remove()
    }
}

document.getElementById("delete").onclick = function() { // Remove all charts
    DeleteBar("tempChart")
    DeleteBar("humidChart")
    DeleteBar("pressureChart")
}

document.getElementById("add").onclick = async function() {

    let tempMinInput = document.getElementById("tempMinInput").value
    let tempMaxInput = document.getElementById("tempMaxInput").value

    let humidMinInput = document.getElementById("humidMinInput").value
    let humidMaxInput = document.getElementById("humidMaxInput").value

    let pressureMinInput = document.getElementById("pressureMinInput").value
    let pressureMaxInput = document.getElementById("pressureMaxInput").value

    fetch("data.json", {
        mode: 'cors',
    })
        .then((response) => {
            return response.json();
        })
        .then((object) => {
        // Displays the time and date
        document.getElementById("scope").innerText = object.document.date + " | " + object.document.time;

        for (i = 0; i < Object.keys(object.document.data).length; i++) {
            if (typeof object.document.data[i] !== 'string'){
                let tagName = object.document.data[i - 1] // The tag's name is always one step back from the tag's data

                // Saves the data as correct values (Celsius, hPa, etc.)
                let tagTemp = object.document.data[i].temperature
                let tagHumid = object.document.data[i].humidity
                let tagPressure = object.document.data[i].pressure

                // Converts values to the range of 0-1 for charts
                let clampedTemp = Clamp(tagTemp, tempMinInput, tempMaxInput)
                let clampedHumid = Clamp(tagHumid, humidMinInput, humidMaxInput)
                let clampedPressure = Clamp(tagPressure, pressureMinInput, pressureMaxInput)

                // Creates charts and defines colors in RGBA format
                CreateBar(tagTemp, clampedTemp, "tempChart", 255, 255, 0, 255) // Temperature chart
                CreateBar(tagHumid, clampedHumid, "humidChart", 100, 0, 255, 255) // Humidity chart
                CreateBar(tagPressure, clampedPressure, "pressureChart", 0, 255, 100, 255) // Air pressure chart
            }
        }
    })
    .catch((e) => console.error(e))
}

