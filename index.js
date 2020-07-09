const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require("console.table");
const departments = require("./classes/departments");
const roles = require("./classes/roles");
const employees = require("./classes/employees");
require("dotenv").config();

const choices = ['Add Department','Add Role','Add Employee','View Departments','View Roles','View Employees','Update Employee Roles','Quit'];

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
            name: "role"
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
        }
    ]).then(res => {
        const newRole = new roles(res.role,res.salary,res.department);
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
    let employeesList = getEmployees();
    let rolesList = getRoles();
    let timer = setInterval(updatePrompt, 100);
    function updatePrompt(){
        clearInterval(timer);
        inquirer.prompt([
            {
                type: "list",
                message: "Choose the employee.",
                name: "employee",
                choices: employeesList
            },
            {
                type: "list",
                message: "Choose a new role for the employee.",
                name: "role",
                choices: rolesList
            }
        ]).then(res => {
            console.log(res);
            let employeeName = res.employee.split(" ");
            let employee ={
                first_name: employeeName[0],
                last_name: employeeName[1]
            }
            connection.query("UPDATE employee SET role_id=? WHERE first_name=?, last_name=?",[
                    res.role,
                    employee.first_name,
                    employee.last_name
                ],(err, res) =>{
                if (err){
                    throw err;
                }
                console.log(res.affectedRows);
                init();
            });
        });    
    }
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

function getEmployees(){
    let employees = [];
    connection.query("SELECT first_name, last_name FROM employee;",(err, res) =>{
        if (err)
            throw err;
        res.forEach(employee => {
            employees.push(employee.first_name+" "+employee.last_name);
        })
    })
    return employees;
}

