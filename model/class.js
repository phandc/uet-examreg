const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('class', {
    //attribute
   classID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
   name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
   facultyID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

}, {
    timestamps: false,
    freezeTableName: true
})