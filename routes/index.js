const express = require("express");
const connection = require("./../database/mysql.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let router = express.Router();
const {generateAuthToken, findByCredential, authenticate} = require("./../middleware/authenticate.js");

router.get("/", function(req, res) {
	res.render("home");
});

//sign up
router.get("/register", function(req, res) {
	res.render("register");
})

router.post("/register", function(req, res){
	let username = req.body.name;
	let password = req.body.password;
	if(!username || username.length == 0){
		req.flash("error", "Invalid username!");
		return res.redirect("/register");
	}else if(!password || password.length == 0){
		req.flash("error", "Invalid password!");
		return res.redirect("/register");
	}else{
		
		bcrypt.genSalt(10, (err, salt)=> {
			bcrypt.hash(password, salt, (err, hash)=> {
				if(err) {
					return console.log(err);
				}
				password = hash;
				console.log(password);
				
				connection.query("insert into users(name, password) values(?, ?)", [username, password], function(err) {
					if(err) {
						console.log(err);
						req.flash("error", "Username already exists, please choose another username!")
						return res.redirect("/register");
					}else{
						let token = generateAuthToken(username);
						if(token) {
							res.set({'x-auth': token});
							res.cookie('auth',token, { maxAge: 6000000, httpOnly: true });
							req.flash("success", "Welcome to Yelp Soccer "+username+"!");
							res.redirect("/soccer_stadiums");
						}else{
							return res.redirect("/register");
						}
					}
				})
				
			});
		});
	}
});

//log in
router.get("/login", function(req, res){
	if(!req.cookies.auth){

		res.render("login");
	}else{
		req.flash("success", "You've already logged in!")
		res.redirect("back");
	}
	
})

router.post("/login", function(req, res) {
	let user = req.body.name;
	let password = req.body.password;
	console.log(user);
	findByCredential(user, password, function(result){
		if (result && result.length > 0) {
			let token = generateAuthToken(result[0].name);
			if (token){
				res.header('x-auth', token);
				res.cookie('auth', token, { maxAge: 6000000, httpOnly: true });
				req.flash("success", "Welcome to Yelp Soccer "+user+"!");
				res.redirect("/soccer_stadiums");
			}else{
				req.flash("error", "Incorrect login or disabled account.")
				res.redirect("/login");;
			} 		
		}else{
			req.flash("error", "Incorrect login or disabled account.")
			res.redirect("/login");
		
		}
	});	
	})

//log out
router.get("/logout", authenticate, function(req, res){
	res.cookie('auth', "", {expires: new Date(0)});
	//console.log("Successfully logged out!")
	req.flash("success", "You've successfully logged out!")
	res.redirect("/soccer_stadiums");
})

// connection.end(function(e) {
//     if (e) {
//       return console.log(e.message);
//     }
//   });


module.exports = router;