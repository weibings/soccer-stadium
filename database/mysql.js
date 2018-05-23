const mysql = require('mysql');

let connection = mysql.createConnection({
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	//database:'stadiums'
});

connection.connect((err) =>{
	if(err) {
		console.log(err);
		return;
	}
	console.log('connected as id '+ connection.threadId);

	connection.query('CREATE DATABASE IF NOT EXISTS stadiums', function (err) {
	    if (err) {
	    	console.log(err);
	    }

	    let createTable = 'CREATE TABLE IF NOT EXISTS stadiums.images(ID int NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, price FLOAT NOT NULL, image VARCHAR(500) NOT NULL, description VARCHAR(1000) NOT NULL, location VARCHAR(200) NOT NULL, author VARCHAR(255) NOT NULL, PRIMARY KEY(ID))';
	    connection.query(createTable, function(err) {
	    		if(err) {
	    			console.log(err);
	    		}else{
	    			console.log("Table images has been created");
	    		}
	    	});

	    createTable = 'CREATE TABLE IF NOT EXISTS stadiums.comments(ID int NOT NULL AUTO_INCREMENT, author VARCHAR(255) NOT NULL, text VARCHAR(5000) NOT NULL, img_ID int not null, PRIMARY KEY(ID))';
	    connection.query(createTable, function(err) {
	    		if(err) {
	    			console.log(err);
	    		}else{
	    			console.log("Table comments has been created");
	    		}
	    	});

	    createTable = 'CREATE TABLE IF NOT EXISTS stadiums.users(name VARCHAR(255) NOT NULL, password VARCHAR(5000) NOT NULL, PRIMARY KEY(name))';
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