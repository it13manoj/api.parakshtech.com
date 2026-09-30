const { DataTypes } = require("sequelize");
const sequelize = require("../parakshDB/database.js");

const ContactInquiry = sequelize.define(
  "ContactInquiry",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("new", "in_progress", "contacted", "archived"),
      defaultValue: "new",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "contact_inquiries",
    timestamps: true,
  }
);

module.exports = ContactInquiry;

