const express = require('express');
const app = express();
const routerApi = require('./api');
const db = require('./db');
const cors = require('cors');

app.use(cors());
app.use('/api', routerApi);
app.use('/', express.static('public'));

module.exports = { app, db }






