const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('examroom', {
    //attribute
   roomId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
   roomName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numComputer: {
        type: Sequelize.INTEGER,
        allowNull: false
    }


}, {
    timestamps: false,
    freezeTableName: true
})