const express = require('express');
const router = express.Router();
const db = require('./db');

const tasks = [];

router.use(express.json())
router.get('/tasks', (req, res, next) => {   
    res.send(tasks);
});

router.post('/tasks', (req, res, next) => {
    const newElement = {text: req.body.text}; 
    if(newElement) {
        tasks.push(newElement.text);
        res.status(201).send(newElement);
    }  else {
        res.status(400).send();
    }
});

module.exports = router;