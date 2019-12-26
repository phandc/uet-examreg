const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('examroom', {
    //attribute
   examSessionID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    examSessionName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    startTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    startTime: {
        type: Sequelize.TIME,
        allowNull: false
    },
    numStudent: {
        type: Sequelize.INTEGER,
        allowNull: false
    }


}, {
    timestamps: false,
    freezeTableName: true
})