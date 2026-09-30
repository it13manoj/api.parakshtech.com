const { DataTypes } = require("sequelize")
const sequelize = require("../parakshDB/database")

const ContactUs = sequelize.define(
    "contactus", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
},
    {
        tableName: "constactus",
        timestamps: true,
    }

)

module.exports = ContactUs;