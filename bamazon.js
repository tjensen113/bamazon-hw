var mysql = require("mysql");
var inquirer = require("inquirer");
// const cTable = require('console.table');

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1212QWqw12",
  database: "bamazon"
});
// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  start();       
});
var totalCost = 0;
function start() {    //show inventory first after the connection is made
  
  connection.query("SELECT item_id, product_name, price FROM products", function(err, res) {
    if (err) throw err;
   
    console.table(res);
    inquirer.prompt([
      {
        name:"choice",
        type:"input",
        message: "what is the item_id of the product you would like to order? "
      },
      {
        name: "quantity",
        type: "input",
        message: "How many? ",
      }
    ]).then(function(answer){
      
      // when finished prompting, check existenses to proced or prevent order
      connection.query("SELECT  * FROM products WHERE ?",
        {item_id:answer.choice}, function (err, res) {
      
          if (err ) throw err;
            
          if (answer.quantity > res[0].stock_quantity  ) {
            inquirer
            .prompt([
              {
                type: "input",
                message: "Out of Stock. Would you like to place another order? ",
                name: "continue"
              }
             ]).then(function(answer){
                if(answer.continue == 'yes' || answer.continue == 'y') {
                start()
                }else if (totalCost >= 0) {
                  console.log("Okay, Total to pay is ", parseFloat(Math.round(totalCost * 100) / 100).toFixed(2));
                  connection.end();
                }else {
                  console.log("See you soon!");
                }
              });
              
          } //end of if

           else {  //update Inventory;
            console.log("All items in stock!!");
            totalCost= totalCost + res[0].price * answer.quantity;
            var newQuantity = res[0].stock_quantity - answer.quantity;
            connection.query(`UPDATE products SET stock_quantity=${newQuantity} WHERE item_id = ${answer.choice}`, function(res){
                inquirer
                .prompt([
                  {
                    type: "input",
                    message: "Would you like to place another order? ",
                    name: "continue"
                  }
              ]).then(function(answer){
                  if(answer.continue == "yes" || answer.continue == "y") {
                    start()
                  }else {
                    console.log("Okay, Total to pay is  $", totalCost);
                    connection.end();
                  }
                  
              }) //end of then

            } ) // end of connection query
            
          };//end of else
          
         
        }); // end of function
        
    })  //end of then     
  })
} //end of start() 