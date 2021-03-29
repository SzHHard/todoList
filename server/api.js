const express = require('express');
const router = express.Router();
const db = require('./db');



router.use(express.json())
router.get('/tasks', (req, res) => {
    db.getAllTasks((err, tasks) => {   //err 503
        res.send(tasks);
    });
});

router.post('/tasks', (req, res, next) => {
    const newElement = { text: req.body.text };
    if (newElement) {
        db.insertTask(newElement.text, (err) => {
            res.status(201).send(newElement);
        });

    } else {
        res.status(400).send();
    }
});

router.get('/tasks/:id', (req, res) => {

    db.getTask(req.params.id, (err, row) => {
        if (row) {
            res.send(row);
        } else {

            res.status(400).send();
        }
    });

});

router.delete('/tasks/:id', (req, res) => {

    db.getTask(req.params.id, (error, row) => {
        if(row) {
            db.deleteTask(req.params.id, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(204).send();
                }
            })
        } else {
            res.status(400).send();
        }
    });
});


module.exports = router;