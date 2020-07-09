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
            if (err){
                throw err;
            }
            console.log(res);
        })
    }
}

module.exports = departments;