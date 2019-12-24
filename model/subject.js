const Sequelize = require('sequelize');
const db = require('./ORM');

module.exports = db.sequelize.define('subject', {
    //attribute
    subjectId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    subjectName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numCredit: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lecture: {
        type: Sequelize.STRING,
        allowNull: false
    },

}, {
    timestamps: false,
    freezeTableName: true
})