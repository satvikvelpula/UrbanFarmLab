const _url = "https://eu-central-1.aws.data.mongodb-api.com/app/data-mjiefpu/endpoint/data/v1/action/findOne";

// Tarttee API avaimen omaan databasee joka löytyy sieltä MongoDB sivuilta
const apiKey = "H5BSBKs5bEPavMlZZsSmAqRQ7i9scLtOT5XlwXpUkfoemTp6LTp5mZZSRRO1wYaB";

// Tää pitäs täyttää sun oman databasen tietojen mukaan
const searchPayload = {
	dataSource: "Cluster0",
	database: "Urban&Local",
	collection: "Sensor_data",
	filter: { }, // Tähän voi laittaa esim. ajan ja päivämäärän
};

const headers = {
	"Content-Type": "application/json",
	"Accept": "application/json",
	"api-key": apiKey
};

var http = require('http');
var url = require('url');
var fs = require('fs');
	
http.createServer(function (req, res) {
	var q = url.parse(req.url, true);
	var filename = "." + q.pathname;
	fs.readFile(filename, function(err, data) {
		if (err) {
			res.writeHead(404, {'Content-Type': 'text/html'});
			return res.end("404 Not Found");
		} 
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		return res.end();
		});
}).listen(8080);

fetch(_url, {
	method: "POST",
	headers: headers,
	body: JSON.stringify(searchPayload)
})
.then((response) => {
	console.log(`Response: (${response.status}), msg = ${response.statusText}`)
	if (response.ok) {
		console.log("Success Response");
	} else {
		console.log(response.status);
		console.log("Error");
	}
	return response.json(); // Antaa datan json muodossa (voi muuttaa response.text jos halutaan tekstinä)
})
.then((data) => {
	var jsonData = JSON.stringify(data);
	fs.writeFile('data.json', jsonData, function (err) {
		if (err) throw err;
		console.log('Saved!');
	});
})
.catch((error) => {
	console.error("Error:", error);
});
