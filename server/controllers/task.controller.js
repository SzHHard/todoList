const db = require("../db");
//const Task = db.task;
const Op = db.Sequelize.Op;

// Create and Save a new Task
exports.create = async (req, res) => {

    console.log(req.body);
    // Validate request
    if (!req.body.text) {
       // console.log('aye');
       
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const task = {
        content: req.body.text,
    //    active: true
    };
    try {
        let data = await db.task.create(task)
        
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send({
            message:
                err.message || "Some error occurred while creating the Tutorial."
        });
    }
};

// Retrieve all Tasks from the database.
exports.findAll = async (req, res) => {
    try {
      let tasks = await db.task.findAll()
      res.send(tasks)
    } catch(err) {
       // console.log(err);
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving tasks'
        });
    }
};

// Find a single Task with an id
exports.findOne = (req, res) => {

};

// Update a Task by the id in the request
exports.update = (req, res) => {

};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {

};

// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {

};

// Find all published Tasks
exports.findAllPublished = (req, res) => {

};