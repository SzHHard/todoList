const express = require('express');
const router = express.Router();
const db = require('./db');

const tasks = [];

router.use(express.json())
router.get('/tasks', (req, res) => {   
    db.getAllTasks( (err, tasks) => {   //err 503
        res.send(tasks);
    });
});

router.post('/tasks', (req, res, next) => {
    const newElement = {text: req.body.text}; 
    if(newElement) {
        //tasks.push(newElement.text);
        db.insertTask(newElement.text, (err) => {
            res.status(201).send(newElement);
        });
       
    }  else {
        res.status(400).send();
    }
});

router.get('/tasks/:id', (req, res) => {
    const task = tasks[req.params.id - 1];
    
    if(task) {
        res.send({task: task});
    } else {
        res.status(400).send();
    }
});

router.delete('/tasks/:id', (req, res) => {
    tasks.splice(req.query.id-1, 1);
    res.status(204).send();
});


module.exports = router;