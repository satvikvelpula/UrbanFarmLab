# Vaatii toimiakseen:
# python -m pip install ruuvitag-sensor
# pip install requests
import json

import requests
from datetime import datetime

import asyncio
from ruuvitag_sensor.ruuvi import RuuviTagSensor

# Tässä vaan tallennan ajan ja päivämäärän et sen voi laittaa siihen tietokanta dokumenttiin
now = datetime.now()
date = now.strftime("%d/%m/%Y")
time = now.strftime("%H:%M:%S")

async def main():
	print("Data collection started...")

	# Määrittää ne MAC-osoitteet, joista data haetaan
	# Jos macs on tyhjä, ottaa kaikista löydetyistä datan
	# macs = ["E2:70:D7:96:45:18", "DD:83:3D:A4:CE:C6", "DD:42:FA:12:2A:CD", "EE:DF:9F:BA:8D:49"]
	macs = ["E2:70:D7:96:45:18"]
	
	datas = []
	async for found_data in RuuviTagSensor.get_data_async(macs): # Dataa tulee noin 10 sekunnin välein
		amountOfData = int(len(datas) / 2) + 1
		targetAmount = 600
		elapsedTime = (targetAmount * 10) / 60

		tagName = ""
		match found_data[0]: # Määrittää ruuvitagien nimet MAC-osotteiden perusteella
			case "": # Laita halutun anturin MAC-osoite ja valitse nimi
				tagName = "Tagin nimi"
			case _:
				tagName = "Undefined tag"

		print(f"MAC: {found_data[0]}")
		print("Progress: ", amountOfData, "/", targetAmount)
		timeNow = now.strftime("%H:%M:%S") + 1
		print(timeNow)

		datas.append(tagName)
		datas.append(found_data[1])
		
		if amountOfData >= targetAmount:
			break

	# URL määrittää mitä actionia lähtee tekee esim tässä "insertOne" laitetaan siis yksi tiedosto tietokantaa. 
	# Eri actionit löytyy MongoDB API dokumentaatiosta
	url = "https://eu-central-1.aws.data.mongodb-api.com/app/data-mjiefpu/endpoint/data/v1/action/insertOne"

	headers = {"api-key": "H5BSBKs5bEPavMlZZsSmAqRQ7i9scLtOT5XlwXpUkfoemTp6LTp5mZZSRRO1wYaB"}  # Tänne taas pitäs laittaa se API key joka löytyy oman MongoDB databasen sivuilta

	documentToAdd = {"date": date, "time": time, "data": datas}

	# Tää pitäs täyttää sun oman databasen tietojen mukaan
	insertPayload = {
		"dataSource": "Cluster0",
		"database": "Urban&Local",
		"collection": "Sensor_data",
		"document": documentToAdd
	}

	print("Sending...")

	response = requests.post(url, headers=headers, json=insertPayload)

	print("Response: (" + str(response.status_code) + "), msg = " + str(response.text))

	if response.status_code == 201:
		print("Added Successfully")
		print("Minutes of data: " + str(elapsedTime))
	else:
		print("Error")

# Tämä vaaditaan asynkroonisiin ruuvitag funktioihin
if __name__ == "__main__":
	asyncio.get_event_loop().run_until_complete(main())