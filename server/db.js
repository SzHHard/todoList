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
    db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, content TEXT, active INTEGER DEFAULT(1))', (err) => {
        if (err && err.message == "SQLITE_ERROR: table tasks already exists") {
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

//  let id = {id: -1};

//  countRows( (err, row) => {
//     console.log('rowcount: ' + row['COUNT(*)']);
//     id.id = row['COUNT(*)'];
// })
// console.log('id.id: ' + id.id);
// id = id.id || 1;
// console.log('id: ' + id);

 let id = countRows( (err, row) => {return row['COUNT(*)']}) || 1; // как пофиксить асинхронность? 

 countRows( (err, row) => {
     id = row['COUNT(*)'] + 1;
     console.log('line 67: ' + id);
 })

 
//let id = {id: 0};

// const changeId = () =>  {
//     id.id = 10;
//     countRows( (err, row) => {
//         console.log('row: ' + row['COUNT(*)']);
//         id.id = row['COUNT(*)'];
//         console.log('inner inner: ' + id.id);
//     });
//     console.log('inner ' +id);
// }
// changeId(); 
// id = id.id;
// console.log(id);




function insertTask(task, done) {
    db.run("INSERT INTO tasks (id, content) VALUES ($id, $task)", { $id: id++, $task: task }, done);
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

function countRows(done) {
    db.get('SELECT COUNT(*) FROM tasks', done)
}

/**
 * Change the state of the task
 * @param {1 or 0 number} active 
 * @param {Task Id number} id 
 */
function switchActive(active, id, done) {
    db.run('UPDATE tasks SET active = $active WHERE id = $id', {
        $active: active,
        $id: id
    }, done);
}

function getGreatestId() {
    return id;
}

module.exports = { createTable, insertTask, deleteTask, getTask, getAllTasks, clearTable, countRows, switchActive, db, getGreatestId }

