const mysql = require('mysql');
require('../config/config.js');

console.log(process.env.user);
console.log(process.env.password);
console.log(process.env.host);
console.log(process.env.database);



let connection = mysql.createConnection({
	host: "be21dea017095a",//process.env.host,
	user: "aaf0553a",//process.env.user,
	password: "us-cdbr-iron-east-01.cleardb.net",//process.env.password,
	database:"heroku_a0714c871127d32"//process.env.database
});

connection.connect((err) =>{
	if(err) {
		console.log(err);
		return;
	}
	console.log('connected as id '+ connection.threadId);

	connection.query(`CREATE DATABASE IF NOT EXISTS heroku_a0714c871127d32`, function (err) {
	    if (err) {
	    	console.log(err);
	    }

	    let createTable = 'CREATE TABLE IF NOT EXISTS images(ID int NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, price FLOAT NOT NULL, image VARCHAR(500) NOT NULL, description VARCHAR(1000) NOT NULL, location VARCHAR(200) NOT NULL, author VARCHAR(255) NOT NULL, PRIMARY KEY(ID))';
	    connection.query(createTable, function(err) {
	    		if(err) {
	    			console.log(err);
	    		}else{
	    			console.log("Table images has been created");
	    		}
	    	});

	    createTable = 'CREATE TABLE IF NOT EXISTS comments(ID int NOT NULL AUTO_INCREMENT, author VARCHAR(255) NOT NULL, text VARCHAR(5000) NOT NULL, img_ID int not null, PRIMARY KEY(ID))';
	    connection.query(createTable, function(err) {
	    		if(err) {
	    			console.log(err);
	    		}else{
	    			console.log("Table comments has been created");
	    		}
	    	});

	    createTable = 'CREATE TABLE IF NOT EXISTS users(name VARCHAR(255) NOT NULL, password VARCHAR(5000) NOT NULL, PRIMARY KEY(name))';
	    connection.query(createTable, function(err) {
	    		if(err) {
	    			console.log(err);
	    		}else{
	    			console.log("Table users has been created");
	    		}
	    	});
	});

});

module.exports = connection;