let { DataTypes} = require('sequelize')

module.exports = function Task(sequelize) {
    const Task = sequelize.define('task', {
        content: DataTypes.TEXT,
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    })
    return Task;
}