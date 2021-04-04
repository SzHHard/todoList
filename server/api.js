const express = require('express');
const router = express.Router();
const db = require('./db');



router.use(express.json())
router.get('/tasks', (req, res) => {
    console.log(req.query);
    // if(!req.query.content) {
    db.getAllTasks((err, tasks) => {   //err 503
        res.send(tasks);
    });
    //  } else {
    //     db.findIdByContentAndStatus(req.query.content, req.query.active, (err, row) => {
    //         console.log('row id:' + row.id);
    //         res.send({id: row.id}).json();
    //     })
    // } 
});

router.post('/tasks', (req, res, next) => {
    const newElement = { text: req.body.text };
    if (newElement) {
        db.insertTask(newElement.text, (err) => {
          let id = 0;
           db.getTask(db.getGreatestId() - 1, (err, row) => {
                if(err) {
                    console.log(err);
                }   else {
                    console.log('row id: ' + row.id);
                    id = row.id;
                    console.log('id:' + id);
                    res.status(201).send({id: id});
                }
            });
           
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
    console.log('reqquerycontent= ' + req.query.content)
    console.log('reqparamsid = ' + req.params.id)
     if(req.query.content){
        db.changeContent(req.query.content, req.params.id, (err) => {
            if(err) {
                console.log(err)
            }
            res.send();
        })
     }  else {

    //создать проверку на существование строки с выбранным id
    db.getTask(req.params.id, (err, row) => {
        if (row) {
            let state = req.query.active;
            //console.log(state) // отладочка
            switch (state) {
                case 'true':
                    state = 1;
                    break;
                case 'false':
                    state = 0;
                    break;
                default: console.log('You had to pass "true" or "false" to the PUT query');
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