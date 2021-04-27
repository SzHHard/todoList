const express = require('express');
const routerApi = require('./api');
const db = require('./db');
const cors = require('cors');
const path = require('path')
const process = require('process')

const app = express();

app.use(cors());

app.use('/api/tasks', routerApi);

app.use('/', express.static(path.resolve(process.cwd(), 'public')))
module.exports = { app, db }








