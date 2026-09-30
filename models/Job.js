const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const Job = sequelize.define(
  "Job",
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
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Software Engineering",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Remote / Hybrid",
    },
    job_type: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Full-Time",
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "2+ Years",
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "Competitive",
    },
    description: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    requirements: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    responsibilities: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    deadline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "jobs",
    timestamps: true,
  }
);

module.exports = Job;

