const mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: '<password>',
    database: "company_db"
});

class departments {
    constructor(name){
        this.name = name;
    }

    getName(){
        return this.name;
    }
    postNewDepartment(){
        connection.query("INSERT INTO department SET ?",{
            name: this.getName()
        },(err, res) =>{
            if (err)
                throw err;
        })
    }
    returnAllDepartments(){
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
}

module.exports = departments;