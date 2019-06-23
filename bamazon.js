var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host:"localhost",
	port: 3306,
	user:"root",
	password:"1212QWqw12",
	database:"bamazon"
});

connection.connect(function(err){
	if(err)throw err;
	console.log("connected as id" + connection.threadId);

	start();
});

function start(){
	inquirer.prompt({
		
	})
}