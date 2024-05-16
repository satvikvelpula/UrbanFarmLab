# Requires to download:
# python -m pip install ruuvitag-sensor
# pip install requests
import json
import requests
import asyncio

from datetime import datetime
from ruuvitag_sensor.ruuvi import RuuviTagSensor

# Here, only the time and date are saved so that they can be added to the database document
now = datetime.now()
date = now.strftime("%d/%m/%Y")
time = now.strftime("%H:%M:%S")

async def main():
	print("Data collection started...")

	# Defines the MAC addresses from which data is retrieved
	# If macs is empty, it retrieves data from all detected ones
	macs = [""]
	datas = []

	async for found_data in RuuviTagSensor.get_data_async(macs): # Data arrives approximately every 10 seconds
		amountOfData = int(len(datas) / 2) + 1
		targetAmount = 600
		elapsedTime = (targetAmount * 10) / 60

		tagName = ""
		match found_data[0]: # Defines the names of the RuuviTags based on their MAC addresses
			case "": # Enter the MAC address of the desired sensor and choose a name
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

	# URL determines what action to perform, for example, "insertOne" here means inserting one file into the database.
	# Different actions can be found in the MongoDB API documentation.
	url = "https://eu-central-1.aws.data.mongodb-api.com/app/data-mjiefpu/endpoint/data/v1/action/insertOne"

	headers = {"api-key": ""} # Here you should again put the API key that can be found on your own MongoDB database website

	documentToAdd = {"date": date, "time": time, "data": datas}

	# This should be filled according to the data in your own database.
	insertPayload = {
		"dataSource": "", # Your cluster name
		"database": "", # Your database name
		"collection": "", # Your database collection name
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

# This is required for asynchronous RuuviTag functions
if __name__ == "__main__":
	asyncio.get_event_loop().run_until_complete(main())