import { Sequelize } from "sequelize";
import sqlite3 from "sqlite3"; // 👈 لازم ده

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
  dialectModule: sqlite3, // مش better-sqlite3
  logging: false,
});

export default sequelize;
