const express = require('express');
//const bodyParser = require('body-parser');
const connection = require("./../database/mysql.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

function generateAuthToken(username) {
  let access = 'auth';
  let token = jwt.sign({username, access}, process.env.JWT_SECRET).toString();
   return token;
	
};

function findByCredential(username, password, callback){
	connection.query("select * from users where name = ?",[username], function(err, result) {
		if (err) {
			console.log(err);
		}else{
      // res.locals.name = result[0].name;
      // res.locals.type = result[0].type;
      console.log(username);
      console.log(password);
      if(result && result.length > 0){
        console.log(result[0].password);
          bcrypt.compare(password, result[0].password, (err2, res2)=>{
          if(err2){
            return console.log(err2);
          }else{
          	console.log("res2: "+res2)
          	if(res2) {
          		callback(result);
          	}else{
          		callback();
          	}
            
          }
          
        });
        }
			
			}
	    });
}

function authenticate(req, res, next) {
  let token = req.cookies.auth;
  if(!token){
  	req.flash("error", "You need to be logged in to do that");
  	return res.redirect("/login");
  }
  let decoded;
  try{
  	decoded = jwt.verify(token, process.env.JWT_SECRET);
  	console.log(decoded);
  }catch(e){
  	return console.log(e);
  }
  connection.query("select * from users where name=?", [decoded.username], function(err, result){
  	if(err) {
  		return console.log(err);
  	}
  	console.log(result);
  	if(result){
  		if(result.length === 0){
  			req.flash("error", "Please log in first");
  			return res.redirect("/login");
  		}else{
  			req.token = token;
  			next();
  		}
  	}else{
  		res.status(401).send();
  	}
  	
  })
};

function checkStadiumOwnerShip(req, res, next) {
	let user = res.locals.currentUser;
	let id = req.params.id;
	connection.query("select * from images where ID= ?", id, function(err, result) {
		if(err) {
			req.flash("error", "Stadium not found");
			res.redirect("back")
		}
		if(result[0].author === user){
			return next();
		}else{
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	})
};

function checkCommentOwnerShip(req, res, next) {
	let user = res.locals.currentUser;
	let id = req.params.comment_id;
	connection.query("select * from comments where ID= ?", id, function(err, result) {
		if(err) {
			eq.flash("error", "Comment not found");
			res.redirect("back")
		}
		if(result[0].author === user){
			return next();
		}else{
			req.flash("error", "You don't have permission to do that");
			res.redirect("back");
		}
	})
}
module.exports = {generateAuthToken, findByCredential, authenticate, checkStadiumOwnerShip, checkCommentOwnerShip};