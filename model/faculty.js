const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('faculty', {
    //attribute
   facultyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }

}, {
    timestamps: false,
    freezeTableName: true
})