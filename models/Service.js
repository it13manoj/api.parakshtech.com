const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const Service = sequelize.define(
  "Service",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    sub_heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Engineering",
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "fas fa-code",
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    short_desc: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contents: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    sub_content: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    tech: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
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
    tableName: "services",
    timestamps: true,
  }
);

module.exports = Service;

