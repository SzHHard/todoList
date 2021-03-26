const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('../db.sqlite');

// db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, content TEXT)', (err) => {
//     if(err) {
//         console.log('creating trouble');
//         console.log(err);
//     }
// });



// db.run('INSERT INTO tasks (id, content) VALUES (1, "create backend for todoList")', (err) => {
//     if(err) {
//         console.log('inserting trouble');
//         console.log(err);
//     }
// });




module.exports = db;

