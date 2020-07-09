const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "<password>",
    database: "company_db"
});

class roles {
    constructor(title, salary, department_id){
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    getTitle(){
        return this.title;
    }
    getSalary(){
        return this.salary;
    }
    getDepartmentId(){
        return this.department_id;
    }
    postNewRole(){
        connection.query("INSERT INTO role SET ?;",{
            title: response.new_role,
            salary: response.salary,
            department_id: response.department,
        },(err, res) =>{
            if (err){
                throw err;
            }
            console.table(res);
        })
    }
    getAllRoles(){
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
}

module.exports = roles;