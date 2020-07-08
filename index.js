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
    database: "auction_db"
});
  
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    init();
});

let choices = ['Add Department','Add Role','Add Employee','View Departments','View Roles','View Employees','Update Employee Roles','Quit'];

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
            init();
        }
        if(option.choice == 'Add Role'){
            //Do something
            addRole();
            init();
        }
        if(option.choice == 'Add Employee'){
            //Do something
            addEmployee();
            init();
        }
        if(option.choice == 'View Departments'){
            //Do something
            viewDepartments();
            init();
        }
        if(option.choice == 'View Roles'){
            //Do something
            viewRoles();
            init();
        }
        if(option.choice == 'View Employees'){
            //Do something
            viewEmployees();
            init();
        }
        if(option.choice == 'Update Employee Roles'){
            //Do something
            updateEmployeeRoles();
            init();
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
    console.log("Adding Employee");
}

function viewDepartments(){
    console.log("Viewing Departments");
}

function viewEmployees(){
    console.log("Viewing Employess");
}

function viewRoles(){
    console.log("Viewing Roles");
}

function updateEmployeeRoles(){
    console.log("Updating Employee Role");
}

//End connection to database
function endConnection() {
    connection.end();
}