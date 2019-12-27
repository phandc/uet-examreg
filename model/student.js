const Sequelize = require('sequelize');
const db = require('./orm');

module.exports = db.sequelize.define('students', {
    //attribute
    studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    userID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    student_code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
   dob: {
        type: Sequelize.DATE
    }
}, {
    timestamps: false,
    freezeTableName: true
})