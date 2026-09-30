const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const Portfolio = sequelize.define(
  "Portfolio",
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
    sub_heading: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "webapp", // webapp, website, android, cloud, ai
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Supports JSON array of multiple image filenames/URLs or a single image string
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Enterprise Partner",
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "2024",
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Live",
    },
    // Array of technology tags e.g. ["React 19", "Node.js", "PostgreSQL"]
    tech: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    // Array of key features/deliverables
    features: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    impact: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "portfolios",
    timestamps: true,
  }
);

module.exports = Portfolio;

