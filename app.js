const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const request = require('request');
const env = require('dotenv').config();

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search/:input', function (req, res) {
  var query= req.params.input;
  var url= "http://api.openweathermap.org/data/2.5/forecast?q="+query+'&APPID='+process.env.WEATHER_API_ID
  request(url, function(error, response, data) {
  if (!error && response.statusCode == 200) {
  console.log(data)
  res.send(data)
}
})
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});