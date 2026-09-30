const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    social: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: { linkedin: "", github: "", twitter: "" },
    },
    order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "teams",
    timestamps: true,
  }
);

module.exports = Team;

