const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const SiteContent = sequelize.define(
  "SiteContent",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // e.g. 'hero', 'about_us', 'why_choose_us', 'our_features', 'stats', 'footer'
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub_heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contents: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    images: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "site_contents",
    timestamps: true,
  }
);

module.exports = SiteContent;

