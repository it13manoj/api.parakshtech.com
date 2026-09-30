const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt");
const sequelize = require("../parakshDB/database.js")


const User = sequelize.define(
  "User",
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
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,

    hooks: {
      // 🔐 Hash password before create (only if plain text)
      beforeCreate: async (user) => {
        if (user.password && !user.password.startsWith("$2b$") && !user.password.startsWith("$2a$")) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },

      // 🔐 Hash password before update (only if changed and plain text)
      beforeUpdate: async (user) => {
        if (
          user.changed("password") &&
          user.password &&
          !user.password.startsWith("$2b$") &&
          !user.password.startsWith("$2a$")
        ) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  }
);

module.exports = User;
