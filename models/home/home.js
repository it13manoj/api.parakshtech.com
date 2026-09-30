const { DataTypes } = require('sequelize');
const sequelize = require("../../parakshDB/database.js")

const Home = sequelize.define(
    "Home",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        heading: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        sub_heading: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        sub_title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        icon: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        images: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contents: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        sub_content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        pages: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        assets: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: "home",
        timestamps: true,
    }
);

module.exports = Home;

