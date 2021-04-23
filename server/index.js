const express = require('express');
const routerApi = require('./api');
const db = require('./db');
const cors = require('cors');

const app = express();

app.use(cors());

app.use('/api/tasks', routerApi);

app.use('/', express.static(__dirname + 'public'));
module.exports = { app, db }








