var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: 'root',
    password: "",
    database: "BamazonDB"
})

connection.connect(function(err) {
    console.log("connected as id: " + connection.threadId);
})

connection.query("SELECT * FROM products", function(err, res) {
    console.log("Welcome to Work Depot your one stop shop for everything office related!");
    console.log("------------------------------");
    for (var i = 0; i < res.length; i++) {
        console.log("ID: " + res[i].id + " | " + "Product Name: " + res[i].product_name + " | " + "Price: " + res[i].price);
    }
    console.log("------------------------------");
    // letsShop();
});

var start = function() {
  inquirer.prompt({
    name: "yesOrNo",
    type: "rawlist",
    message: "Type yes if you are ready to start shopping or no to continue browsing",
    choices: ["yes", "no"]
  }).then(function(answer) {
    // based on their answer, either call the bid or the post functions
    if (answer.yesOrNo.toLowerCase() === "no") {
      console.log("No rush, take your time browsing. reload the page when your ready to shop.")
    }
    else {
      letsShop();
    }
  });
};

// start();


var letsShop = function() {
connection.query("SELECT * FROM products", function(err, product) {
    if (err) throw err;
    inquirer.prompt([
    		{
            name: "choice",
            type: "input",
            choice: function() {
                var choiceArray = [];
                for (var i = 0; i < product.length; i++) {
                    choiceArray.push(product[i].id);
                }
			},
           		
           	message: "Which product ID would you like to buy?"
                // validate: function(value) {
                //     if (isNaN(value) == false) {
                //         return true;
                //     } else {
                //         return false
             },
        {
            name: "quantity",
            type: "input",
            message: "How many unit of the product would you like to buy?"
                // validate: function(value) {
                //     if (isNaN(value) == false) {
                //         return true;
                //     } else {
                //         return false
                //     }
                // 
            }
        	
       
    ]).then(function(questions) {
            console.log(questions);
            var grandTotal;
            var currentStockQuantity;
            var chosenItem;
            for (var i = 0; i < questions.length; i++) {
                if (res[i].id == questions.choice) {
                    chosenItem = questions[i];
                }
            }

            console.log(chosenItem);

            if (chosenItem.stock_quantity >= parseInt(questions.quantity)) {
                var currentStockQuantity = choseonItem.stock_quantity - questions.quantity;
                connection.query("UPDATE stock_quantity SET ? WHERE ?", [{
                    stock_quantity: currentStockQuantity
                }, {
                    id: choseonItem.id
                }], function(total) {
                    if (error) throw err;
                    var grandTotal = total.quantity * chosenItem.price;
                    console.log("Purchase was successful!");
                    console.log("Grand total: " + "$" + grandTotal);
                    start();
                });
            } else {
                console.log("Insufficient quantity!");
                start();
            }
        });
    });
};

start();
// // // })
// // // }
// // // }
// // //                 // //in video 12.2 4:10 the explains how to create a function that ask an inquire prompt
