const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../db.sqlite');


/**
 * Clears table of all tasks
 * @param {Callback} done 
 */
function clearTable(done) {
    db.run("DROP TABLE tasks", done)
}

/**
 * Creates a new Tasks Table
 * @param {Callback} done 
 */
function createTable(done) {
    db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, content TEXT)', (err) => {
        if(err && err.message == "SQLITE_ERROR: table tasks already exists") {
             done()
        } else {

            done(err)
        }
        
    });
}

/**
 * Get All Tasks
 * @param {(err: Error, tasks: []string) => {}} done 
 */
function getAllTasks(done) {
    db.all('SELECT * FROM tasks', done);
}

/**
 *  Get a task by id
 * @param {number} id 
 * @param {(err: Error, task: string) => {}} done 
 */
function getTask(id, done) {
    db.get('SELECT * FROM tasks WHERE id = $id', {
        $id: id,
    }, done)
}
/**
 * Insert a Task into the table
 * @param {Task Text} task 
 * @param {Callback} done 
 */
function insertTask(task, done) {
    db.run("INSERT INTO tasks (id, content) VALUES (1, $task)", { $task: task }, done);
}

/**
 * Delete a Task from the table by Id
 * @param {Task Id} id 
 * @param {Callback} done 
 */
function deleteTask(id, done) {
    db.run(`DELETE FROM tasks WHERE id = $id`, {
        $id: id
    }, done)
}


module.exports = { createTable, insertTask, deleteTask, getTask, getAllTasks,clearTable, db }

