const mysql = require("mysql");
const inquirer = require("inquirer");
const console_table = require("console.table");
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

let choices = ['Add Department','Add Role','Add Employee','View Departments','View Roles','View Employees','Update Employee Roles','Quit'];

let roles = ['Sales Lead', 'Salesperson', 'Lead Engineer','Software Engineer', 'Accountant','Legal Team Lead', 'Lawyer'];
let departments = [];
function getDepartments(){
    connection.query("SELECT * from department",(err, res) =>{
        if (err){
            throw err;
        }
        console.table(res);
        init();
    })
}

function init(){
    inquirer.prompt({
        type: 'list',
        message: 'Welcome to our company, please choose an action.',
        name: 'choice',
        choices: choices
    }).then((option) => {
        if(option.choice == 'Add Department'){
            //Do something
            addDepartment();
        }
        if(option.choice == 'Add Role'){
            //Do something
            addRole();
        }
        if(option.choice == 'Add Employee'){
            //Do something
            addEmployee();
        }
        if(option.choice == 'View Departments'){
            //Do something
            viewDepartments();
        }
        if(option.choice == 'View Roles'){
            //Do something
            viewRoles();
        }
        if(option.choice == 'View Employees'){
            //Do something
            viewEmployees();
        }
        if(option.choice == 'Update Employee Roles'){
            //Do something
            updateEmployeeRoles();
        }
        if(option.choice == 'Quit'){
            endConnection();
        }
    })
}

function addDepartment(){
    console.log("Adding Department");
}

function addRole(){
    console.log("Adding Role");
}

function addEmployee(){
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
            choices: roles
        },
        {
            type: "list",
            message: "Who is the manager for the employee?",
            name: "manager",
            choices: ['null']
        }
    ]).then(response => {
        connection.query("INSERT INTO employee SET ?",{
            first_name: response.first_name,
            last_name: response.last_name,
            role_id: null,
            manager_id: null
        },(err, res) =>{
            if (err){
                throw err;
            }
            console.table(res);
            init();
        })
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

function updateEmployeeRoles(){
    console.log("Updating Employee Role");
    init();
}

//End connection to database
function endConnection() {
    connection.end();
}