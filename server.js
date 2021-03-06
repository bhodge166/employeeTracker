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

const deptQuestion = [
  {
    message: "What is the name of the department",
    name: "department",
    type: "input",
  },
];

const roleQuestion = [
  {
    message: "What is the job title?",
    name: "title",
    type: "input",
  },
  {
    message: "What is the salary of this position?",
    name: "salary",
    type: "number",
  },
  {
    message: "What department does this role belong to?",
    name: "department",
    type: "input",
  },
];
const addEmployeeQuestion = [
  {
    message: "What is the employees first name?",
    name: "first",
    type: "input",
  },
  {
    message: "What is the employees last name?",
    name: "last",
    type: "input",
  },
  {
    message: "What is the employees role id?",
    name: "role",
    type: "input",
  },
  {
    message: "Who is the employees manager id?",
    name: "manager",
    type: "input",
  },
];

const updateQuestion = [
  {
    message: "What employee do you want to update?",
    name: "employee",
    type: "input",
  },
  {
    message: "What is the rold id you would like to change to?",
    name: "roleid",
    type: "input",
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
        departmentPrompt();
        break;
      case "Add a Role":
        rolePrompt();
        break;
      case "Add an Employee":
        EmployeePrompt();
        break;
      case "Update an Employee Role":
        updateEmployee();
        break;
      case "Quit":
        return;
    }
  });
}

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

function departmentPrompt() {
  inquirer.prompt(deptQuestion).then((data) => addDepartment(data.department));
}

function addDepartment(data) {
  db.query(`INSERT INTO department (name) VALUES ("${data}")`, (err, data) => {
    console.log(data);
    initPrompt();
  });
}

function rolePrompt() {
  inquirer.prompt(roleQuestion).then((data) => addRole(data));
}

function addRole(data) {
  db.promise()
    .query("Select * FROM department")
    .then((res) => {
      const filterRes = res[0].filter((res) => res.name === data.department);
      if (filterRes.length > 0) {
        const deptnumber = filterRes[0].id;
        db.query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${data.title}", ${data.salary}, ${deptnumber})`,
          (err, data) => {
            console.log(data);
            initPrompt();
          }
        );
      } else {
        db.promise()
          .query(`INSERT INTO department (name) VALUES ("${data.department}")`)
          .then(addRole(data));
      }
    });
}

function EmployeePrompt() {
  inquirer.prompt(addEmployeeQuestion).then((data) => {
    addEmployee(data);
  });
}

function addEmployee(data) {
  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.first}", "${data.last}", ${data.role}, ${data.manager})`,
    (err, data) => {
      console.log(data);
      initPrompt();
    }
  );
}

function updateEmployee() {
  inquirer.prompt(updateQuestion).then((data) => verifyEmployee(data));
}

function verifyEmployee(data) {
  db.promise()
    .query(
      "Select employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee FROM employee"
    )
    .then((res) => {
      const filterRes = res[0].filter((res) => res.employee === data.employee);
      if (filterRes.length > 0) {
        const employeenumber = filterRes[0].id;
        db.query(
          `UPDATE employee SET role_id = ${data.roleid} WHERE id = ${employeenumber}`,
          (err, data) => {
            console.log(data);
            initPrompt();
          }
        );
      }
    });
}
initPrompt();
