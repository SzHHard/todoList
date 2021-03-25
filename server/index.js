const express = require('express');
const app = express();
const routerApi = require('./api');

app.use('/api', routerApi);
app.use('/', express.static('public'));

console.log("Start Listening at Port 3000");
app.listen(3000);