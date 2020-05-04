const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const constants = require("./constants");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {

    // get user input
    query = req.body.cityName;
    unit = "metric"
    const apiKey = constants.apikey;

    // speicfy right get request to weather APi based on user input
    const url = "https://api.openweathermap.org/data/2.5/find?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    //send get request to weather API
    https.get(url, function (response) {
        console.log("Weather API status: " + response.statusCode);

        //parse response code from Weather API
        response.on("data", function (data) {
            const weatherData = JSON.parse(data);
            const temp = weatherData.list[0].main.temp;
            const dscrptn = weatherData.list[0].weather[0].description;

            const iconID = weatherData.list[0].weather[0].icon;
            const iconURL = "http://openweathermap.org/img/wn/" + iconID + "@2x.png";

            res.writeHead(200, { "Content-Type": "text/html" });

            res.write("<h1>The weather condition at "+ query + " is " + dscrptn + "</h1>");
            res.write("<p>Current temperature at Vancouver is " + temp + " degree Celcius </p>");
            res.write("<img src=" + iconURL + ">");
            res.send();
        })
    });

})





app.listen(3000, function (req, res) {
    console.log("Server started");
})