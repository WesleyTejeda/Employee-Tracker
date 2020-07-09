const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const departments = require("./classes/departments");
const roles = require("./classes/roles");
const employees = require("./classes/employees");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: process.env.DB_PASS,
    database: "company_db"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    init();
});

const choices = ['Add Department','Add Role','Add Employee','View Departments','View Roles','View Employees','Update Employee Roles','Quit'];


function init(){
    inquirer.prompt({
        type: 'list',
        message: 'Welcome to our company, please choose an action.',
        name: 'choice',
        choices: choices
    }).then((option) => {
        if(option.choice == 'Add Department'){
            addDepartment();
        }
        if(option.choice == 'Add Role'){
            addRole();
        }
        if(option.choice == 'Add Employee'){
            addEmployee();
        }
        if(option.choice == 'View Departments'){
            viewDepartments();
        }
        if(option.choice == 'View Roles'){
            viewRoles();
        }
        if(option.choice == 'View Employees'){
            viewEmployees();
        }
        if(option.choice == 'Update Employee Roles'){
            updateEmployeeRoles();
        }
        if(option.choice == 'Quit'){
            endConnection();
        }
    })
}
function addDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new department?",
            name: "new_department"
        }
    ]).then(res => {
        const newDept = new departments(res.new_department);
        newDept.postNewDepartment();
        init();
    });
}

function addRole(){
    let deptList = getDepartments();
    let managersList = getManagers();
    inquirer.prompt([
        {
            type: "input",
            message: "What is the new role?",
            name: "new_role"
        },
        {
            type: "input",
            message: "What is the salary of the role?",
            name: "salary"
        },
        {
            type: "list",
            message: "Choose a department for this role.",
            name: "department",
            choices: deptList
        },
        {
            type: "list",
            message: "Who is the manager for the employee?",
            name: "manager",
            choices: managersList
        }
    ]).then(res => {
        const newRole = new roles(res.new_role,res.salary,res.department,res.manager);
        newRole.postNewRole();
        init();
    });
}
function addEmployee(){
    let rolesList = getRoles();
    let managersList = getManagers();
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name?",
            name: "first_name"
        },
        {
            type: "input",
            message: "What is the employee's last name?",
            name: "last_name"
        },
        {
            type: "list",
            message: "Choose a role for employee.",
            name: "role",
            choices: rolesList
        },
        {
            type: "list",
            message: "Who is the manager for the employee?",
            name: "manager",
            choices: managersList
        }
    ]).then(res => {
        const newEmployee = new employees(res.first_name,res.last_name,res.role,res.manager);
        newEmployee.postNewEmployee();
    });
}

function viewDepartments(){
    connection.query("SELECT * FROM department",(err, res) =>{
        if (err)
            throw err;
        console.table(res);
        init();
    });
}

function viewEmployees(){
    connection.query("SELECT * FROM employee",(err, res) =>{
        if (err){
            throw err;
        }
        console.table(res);
        init();
    });
}

function viewRoles(){
    connection.query("SELECT * FROM role",(err, res) =>{
        if (err){
            throw err;
        }
        console.table(res);
        init();
    });
}
//---------WRITE THIS------------------------
function updateEmployeeRoles(){
    console.log("Updating Employee Role");
    init();
}

//End connection to database
function endConnection() {
    connection.end();
}

function getDepartments(){
    let departments = [];
    connection.query("SELECT name FROM department",(err, res) =>{
        if (err)
            throw err;
        res.forEach(department => {
            departments.push(department.name);
        })
    });
    return departments;
}

function getManagers(){
    let managers = [];
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;",(err, res) =>{
        if (err)
            throw err;
        res.forEach(manager => {
            managers.push(manager.first_name+" "+manager.last_name);
        })
    });
    return managers;
}

function getRoles(){
    let roles = [];
    connection.query("SELECT title FROM role;",(err, res) =>{
        if (err)
            throw err;
        res.forEach(role => {
            roles.push(role.title);
        })
    })
    return roles;
}

