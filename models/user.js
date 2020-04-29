const {Sequelize, DataTypes} = require('sequelize');
const {sequelize} = require('./../config/db');
const bcrypt = require('bcrypt');
const Model = Sequelize.Model;

class User extends Model {
    // generateHash(password) {
    //     return bcrypt.hash(password, 10);
    // }

    // checkPassword(password) {
    //     return bcrypt.compare(password, this.password)
    // }
};

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},{
    sequelize,
    modelName: 'user',

    //to set a custom table name
    // freezeTableName: true,
    // tableName: 'Users'
});

//Game.sync();

module.exports = {User};