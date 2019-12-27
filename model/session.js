const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('session', {
    //attribute
   sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    subjectID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subjectName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numCredit: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    time: {
        type: Sequelize.STRING,
        allowNull: false
    },
   room: {
        type: Sequelize.STRING,
        allowNull: false
    },
    numComputer: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    duration: {
        type: Sequelize.STRING,
        allowNull: false
    }

}, {
    timestamps: false,
    freezeTableName: true
})