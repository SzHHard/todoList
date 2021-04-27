const db = require("../db");
const Task = db.task;
const Op = db.Sequelize.Op;

// Create and Save a new Task
exports.create = async (req, res) => {
  // Validate request
  if (!req.body.text) {
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
    let data = await Task.create(task)

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
    let tasks = await Task.findAll()
    res.send(tasks)
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving tasks'
    });
  }
};

// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task.findByPk(id)
    .then(data => {
      if (data === null) {
        res.status(404).send();
      }
      res.send(data);
    })
    .catch(err => {
      res.status(404).send({
        message: 'Error retrieving Task with id=' + id
      })
    })
};

// Update a Task by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  if (req.query.active) {
    Task.update(
      { active: req.query.active },
      { where: { id: id } }
    )
      .then(num => {
        if (num == 1) {
          res.send();
        } else {
          res.status(400).send();
        }
      })
      .catch(err => {
        res.status(400).send({
          message: "Error updating Task with id=" + id
        });
      });
  } else {
    if (req.query.content) {
      Task.update(
        { content: req.query.content },
        { where: { id: id } }
      )
        .then(num => {
          if (num !== 0) {
            res.send();
          } else {
            res.status(400).send({
              message: `Cannot update Task with id=${id}. Maybe Task was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(400).send({
            message: "Error updating Task with id=" + id
          });
        });
    }
  }
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Task.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Task was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Task with id=${id}. Maybe Task was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Task with id=" + id
      });
    });
};

// Delete all Tasks from the database.
exports.deleteAll = (req, res) => {
  Task.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Tasks were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tasks."
      });
    });
};

// Find all published Tasks
exports.findAllCompleted = (req, res) => {
  Task.findAll({ where: { active: false } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tasks."
      });
    });
};