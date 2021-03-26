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

router.get('/tasks', (req, res, next) => {   
    res.send(tasks);
});

router.post('/tasks', (req, res, next) => {
    const newElement = {name: req.query.name}; 
    if(newElement) {
        tasks.push(newElement);
        res.status(201).send(newElement);
    }  else {
        res.status(400).send();
    }
});

module.exports = router;