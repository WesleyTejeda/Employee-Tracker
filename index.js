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
    console.log(
        `
        .%%%%%%..%%...%%..%%%%%...%%.......%%%%...%%..%%..%%%%%%..%%%%%%.
        .%%......%%%.%%%..%%..%%..%%......%%..%%...%%%%...%%......%%.....
        .%%%%....%%.%.%%..%%%%%...%%......%%..%%....%%....%%%%....%%%%...
        .%%......%%...%%..%%......%%......%%..%%....%%....%%......%%.....
        .%%%%%%..%%...%%..%%......%%%%%%...%%%%.....%%....%%%%%%..%%%%%%.
        .................................................................
             .%%%%%%..%%%%%....%%%%....%%%%...%%..%%..%%%%%%..%%%%%..
             ...%%....%%..%%..%%..%%..%%..%%..%%.%%...%%......%%..%%.
             ...%%....%%%%%...%%%%%%..%%......%%%%....%%%%....%%%%%..
             ...%%....%%..%%..%%..%%..%%..%%..%%.%%...%%......%%..%%.
             ...%%....%%..%%..%%..%%...%%%%...%%..%%..%%%%%%..%%..%%.
             ........................................................`);
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

//---------FIX------------------------
async function addRole(){
    let deptList = await getDepartments();
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
    ]).then(async function(res){
        let deptId = await translateDepartment(res.department);        
        const newRole = new roles(res.role,res.salary,deptId);
        newRole.postNewRole();
        init();
    });
}
async function addEmployee(){
    let rolesList = await getRoles();
    let managersList = await getManagers();
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
    ]).then(async res => {
        let roleId = await translateRole(res.role);
        let managerId = await translateManager(res.manager);
        const newEmployee = new employees(res.first_name,res.last_name,roleId,managerId);
        newEmployee.postNewEmployee();
        init();
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
    let query = `SELECT employee.id, employee.first_Name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id AS Manager
    FROM employee JOIN department  JOIN role 
    WHERE employee.role_id = role.id AND role.department_id = department.id;`
    connection.query(query,(err, res) =>{
        if (err){
            throw err;
        }
        console.table(res);
        init();
    });
}

function viewRoles(){
    connection.query("SELECT role.id, role.title, role.salary, department.name as department FROM role JOIN department WHERE role.department_id = department.id;",(err, res) =>{
        if (err){
            throw err;
        }
        console.table(res);
        init();
    });
}
//---------FIX------------------------
async function updateEmployeeRoles(){
    let employeesList = await getEmployees();
    let rolesList = await getRoles();
    //Nest list functions
    updatePrompt();
    function updatePrompt(){
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
        ]).then(async res => {
            let roleId = await translateRole(res.role);
            let employeeName = res.employee.split(" ");
            let employee ={
                first_name: employeeName[0],
                last_name: employeeName[1]
            }
            connection.query("UPDATE employee SET role_id=? WHERE first_name=? AND last_name=?",[
                    roleId,
                    employee.first_name,
                    employee.last_name
                ],(err, res) =>{
                if (err){
                    throw err;
                }
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
    return new Promise(resolve => {
        connection.query("SELECT name FROM department",(err, res) =>{
            if (err)
                throw err;
            let departments = [];
            res.forEach(department => {
                departments.push(department.name);
            })
            resolve(departments);
        })
    })
}

function getManagers(){
    return new Promise(resolve => {
        connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL;",(err, res) =>{
            if (err)
                throw err;
            let managers = [];
            res.forEach(manager => {
                managers.push(manager.first_name+" "+manager.last_name);
            })
            resolve(managers);
        })
    })
}

function getRoles(){
    return new Promise(resolve => {
        connection.query("SELECT * FROM role ",(err, res) =>{
            if (err)
                throw err;
            let roles = [];
            res.forEach(role => {
                roles.push(role.title);
            })
            resolve(roles);
        })
    })
}

function getEmployees(){
    return new Promise(resolve => {
        connection.query("SELECT * FROM employee",(err, res) =>{
            if (err)
                throw err;
            let employees = [];
            res.forEach(employee => {
                employees.push(employee.first_name+" "+employee.last_name);
            })
            resolve(employees);
        })
    })
}

function translateDepartment(department) {
    return new Promise(resolve => {
        connection.query("SELECT * FROM department WHERE ?",{name: department},(err, res) =>{
            if (err)
                throw err;
            resolve(res[0].id)
        })
    })
}

function translateManager(manager) {
    return new Promise(resolve => {
        let managerInfo = manager.split(" ");
        connection.query("SELECT * FROM employee WHERE ? AND ?",[{first_name: managerInfo[0]}, {last_name: managerInfo[1]}],(err, res) =>{
            if (err)
                throw err;
            resolve(res[0].id)
        })
    })
}

function translateRole(role) {
    return new Promise(resolve => {
        connection.query("SELECT * FROM role WHERE ?",{title: role},(err, res) =>{
            if (err)
                throw err;
            resolve(res[0].id)
        })
    })
}

function translateDepartment(department) {
    return new Promise(resolve => {
        connection.query("SELECT * FROM department WHERE ?",{name: department},(err, res) =>{
            if (err)
                throw err;
            resolve(res[0].id)
        })
    })
}