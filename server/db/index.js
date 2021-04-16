const { Sequelize, DataTypes } = require('sequelize');
const sqlite3 = require('sqlite3');


const sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: './db.sqlite'
});

async function auth() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.task = require('./models/task.model.js')(sequelize);
module.exports = db