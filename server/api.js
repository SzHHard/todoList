const express = require('express');
const router = express.Router();
const db = require('./sqliteDb');

db.all('SELECT * FROM tasks', (err, rows) => {
    if(err){
        throw err;
    }
    else {
        console.log(rows);
    }
});

const tasks = ['testString'];
router.get('/tasks', (req, res, next) => {   //new
    res.send(tasks);
});


module.exports = router;