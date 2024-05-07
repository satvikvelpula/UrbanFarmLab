function Clamp(val, minVal, maxVal) {
    // Muuttaa arvot 0 ja 1 välille, jotta chartcss voi käyttää niitä
    // Min ja max muuttamalla voi katsoa niiden väliltä arvoja tarkemmin
    return (val - minVal) / (maxVal - minVal);
}

function CreateBar(data, clampedData, targetID, r, g, b ,a) {
    newBar = document.createElement("td")
    newBar.className = "dataBar"
    newBar.style.setProperty("--size", clampedData) // --size on palkin korkeus ja pitää olla 0 ja 1 välillä
    newBar.style.setProperty("background-color", "rgba" + "(" +
    (r * clampedData) + "," + 
    (g * clampedData) + "," + 
    (b * clampedData) + "," + 
    (a * clampedData) + ")")

    tooltip = document.createElement("span")
    tooltip.className = "tooltip"
    tooltip.innerHTML = data
    newBar.appendChild(tooltip)

    document.getElementById(targetID).appendChild(newBar)
}

function DeleteBar(targetID) {
    while (document.getElementById(targetID).lastElementChild.nodeName == "TD") {
        document.getElementById(targetID).lastElementChild.remove()
    }
}

document.getElementById("delete").onclick = function() { // Poistaa kaikki kaaviot
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
            console.log(response);
            return response.json();
        })
        .then((object) => {
        console.log(object)
        // Näyttää ajan ja päivämäärän
        document.getElementById("scope").innerText = object.document.date + " | " + object.document.time;

        for (i = 0; i < Object.keys(object.document.data).length; i++) {
            if (typeof object.document.data[i] !== 'string'){
                let tagName = object.document.data[i - 1] // Tagin nimi on aina 1 taaksepäin tagin datasta

                // Tallentaa datan oikeina arvoina (Celsius, hPa jne.)
                let tagTemp = object.document.data[i].temperature
                let tagHumid = object.document.data[i].humidity
                let tagPressure = object.document.data[i].pressure

                    // Muuttaa arvot 0-1 väliin kaavioille
                let clampedTemp = Clamp(tagTemp, tempMinInput, tempMaxInput)
                let clampedHumid = Clamp(tagHumid, humidMinInput, humidMaxInput)
                let clampedPressure = Clamp(tagPressure, pressureMinInput, pressureMaxInput)

                // Luo kaaviot ja määrittää värit rgba muodossa
                CreateBar(tagTemp, clampedTemp, "tempChart", 255, 255, 0, 255) // Lämpötilakaavio
                CreateBar(tagHumid, clampedHumid, "humidChart", 100, 0, 255, 255) // Kosteuskaavio
                CreateBar(tagPressure, clampedPressure, "pressureChart", 0, 255, 100, 255) // Ilmanpainekaavio
            }
        }
    })
    .catch((e) => console.error(e))
}

