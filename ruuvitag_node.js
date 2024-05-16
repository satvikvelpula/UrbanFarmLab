/* 
	npm install mongodb
*/

const _url = "";

// You'll need an API key for your own database, which can be found on the MongoDB website.
const apiKey = "";

// This should be filled according to the data in your own database.
const searchPayload = {
	dataSource: "", // Your cluster name
	database: "", // Your database name
	collection: "", // Your database collection name
	filter: { }, // You can include the time and date here (if you want), or it can be left empty for now.
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
	return response.json(); // Provide the data in JSON format (can change response.text if text is preferred).
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
