const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "pass",
    database: "employee_db",
  },
  console.log(`Connected to database.`)
);

const initQuestions = [
  {
    message: "What would you like to do?",
    name: "choice",
    type: "list",
    choices: [
      "View all Departments",
      "View all Roles",
      "View all Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Quit",
    ],
  },
];

function initPrompt() {
  inquirer.prompt(initQuestions).then((data) => {
    switch (data.choice) {
      case "View all Departments":
        getDepartment();
        break;
      case "View all Roles":
        getRoles();
        break;
      case "View all Employees":
        getEmployees();
        break;
      case "Add a Department":
        addDepartment();
        break;
      case "Add a Role":
        addRole();
        break;
      case "Add an Employee":
        addEmployee();
        break;
      case "Update an Employee Role":
        updateEmployeeRole();
        break;
      case "Quit":
        return;
    }
  });
}

initPrompt();

function getDepartment() {
  db.query("SELECT * FROM department", (err, data) => {
    console.table(data);
    initPrompt();
  });
}

function getRoles() {
  db.query(
    "SELECT role.title AS Job, role.id, department.name AS Department, role.salary FROM role JOIN department ON department.id = role.department_id",
    (err, data) => {
      console.table(data);
      initPrompt();
    }
  );
}

function getEmployees() {
  db.query(
    "SELECT employee.id AS Id, employee.first_name AS First, employee.last_name AS Last, role.title AS Job, department.name AS Department, role.salary AS Salary,CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee JOIN role ON role.id = employee.role_id JOIN department ON department.id = role.department_id LEFT JOIN employee e on employee.manager_id = e.id",
    (err, data) => {
      console.table(data);
      initPrompt();
    }
  );
}
