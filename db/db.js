const pgp = require('pg-promise')();
const db = pgp('postgres://carolinamartes@localhost:5432/cities');
var json = require('./city_list.json');
