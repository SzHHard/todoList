const express = require('express');
const app = express();
const routerApi = require('./api');
const db = require('./db');


app.use('/api', routerApi);
app.use('/', express.static('public'));

db.createTable(() => {
    console.log("Start Listening at Port 3000");
    app.listen(3000);
})



