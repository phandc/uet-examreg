const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('user', {
    //attribute
    userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING,
        allowNull: false,
    }

}, {
    timestamps: false,
    freezeTableName: true
})
