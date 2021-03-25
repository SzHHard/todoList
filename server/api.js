const express = require('express');
const router = express.Router();

const tasks = ['testString'];
router.get('/tasks', (req, res, next) => {   //new
    res.send(tasks);
});


module.exports = router;