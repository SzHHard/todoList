const express = require('express');
const router = express.Router();
const db = require('./db');



router.use(express.json())
router.get('/tasks', (req, res) => {

    db.getAllTasks((err, tasks) => {
        res.send(tasks);
    });

});

router.post('/tasks', (req, res, next) => {
    const newElement = { text: req.body.text };
    if (newElement) {
        db.insertTask(newElement.text, (err) => {
            let id = 0;

            let maxId = -1;
            db.getMaxIdFromTable((err, row) => {
               maxId = row['MAX(id)'];
               db.getTask(maxId, (err, row) => {
                if (err) {

                } else {

                    id = row.id;

                    res.status(201).send({ id: id });
                }
            });
            })

           

      
            //.json();
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
        if (row) {
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

router.put('/tasks/:id', (req, res) => {


    if (req.query.content) {
        db.changeContent(req.query.content, req.params.id, (err) => {
            if (err) {
                console.log(err)
            }


            res.send();
        })
    } else {
        db.getTask(req.params.id, (err, row) => {
            if (row) {
                let state = req.query.active;

                switch (state) {
                    case 'true':
                        state = 1;
                        break;
                    case 'false':
                        state = 0;
                        break;
                    default: return res.status(400).send();
                }
                db.switchActive(state, req.params.id, (err) => {

                    res.send();

                });
            } else
                res.status(400).send();
        })
    }

})


module.exports = router;