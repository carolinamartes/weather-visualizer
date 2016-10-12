const express = require('express');
const mustacheExpress = require('mustache-express');
const app = express();
const request = require('request');
const env = require('dotenv').config();
const pgp = require('pg-promise')();
const db = pgp('postgres://carolinamartes@localhost:5432/cities');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index');
});

app.get('/search/:input', function (req, res) {
  var query= req.params.input;
  var url= "http://api.openweathermap.org/data/2.5/forecast?id="+query+'&units=imperial'+'&APPID='+process.env.WEATHER_API_ID
  request(url, function(error, response, data) {
  if (!error && response.statusCode == 200) {
  res.send(data)
}
})
});

app.get('/autocomplete/:input', function (req, res, next) {
var input= req.params.input;
  db.many(
    "SELECT * FROM cities WHERE data->>'name' ILIKE $1 LIMIT 10", [input+'%']
  ).catch(function(error) {
    console.log(error)
    next();
  }).then(function(data) {
    result=[]
    data.forEach(function(el){
      if (!result.includes(el)){
      result.push({label:el.data.name+", "+el.data.country, value:el.data._id})
    }
    })
    res.send(result)
  });
});

app.get('/geolocation/:city/:state', function (req, res, next) {
let city= req.params.city;
let state=req.params.state;

  db.many(
    "SELECT * FROM cities WHERE data->>'name' = $1 AND data->>'country' = $2 LIMIT 10", [city, state]
  ).catch(function(error) {
    console.log(error)
    next();
  }).then(function(data) {
    result=[]
    data.forEach(function(el){
      if (!result.includes(el)){
      result.push({label:el.data.name+", "+el.data.country, value:el.data._id})
    }
    })
    res.send(result)
  });
});



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
