const mysql = require("mysql");
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

class employees {
    constructor(first_name,last_name, role_id, manager_id){
        this.first_name = first_name;
        this.last_name = last_name;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

    getName(){
        return this.first_name;
    }
    getLastName(){
        return this.last_name;
    }
    getId(){
        return this.role_id;
    }
    getManagerId(){
        return this.manager_id;
    }
    postNewEmployee(){
        connection.query("INSERT INTO employee SET ?",{
            first_name: this.getFirstName(),
            last_name: this.getLastName(),
            role_id: this.getId(),
            manager_id: this.getManagerId()
        },(err, res) =>{
            if (err){
                throw err;
            }
            console.log(res);
        })
    }
}

module.exports = employees;