const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "pass",
    database: "movie_db",
  },
  console.log(`Connected to database.`)
);
