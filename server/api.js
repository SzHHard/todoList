const express = require('express');
const router = express.Router();
const db = require('./db');

const tasks = require('./controllers/task.controller.js');

router.use(express.json())

router.post("/", tasks.create)
// Retrieve all Tasks
router.get("/", tasks.findAll);

// Retrieve all published tasks
router.get("/completed", tasks.findAllCompleted);

// Retrieve a single Task with id
router.get("/:id", tasks.findOne);

// Update a Task with id
router.put("/:id", tasks.update);


router.delete("/clearCompleted", tasks.deleteAllCompleted);

// Delete a Task with id
router.delete("/:id", tasks.delete);



// Delete all tasks
router.delete("/", tasks.deleteAll);



module.exports = router;