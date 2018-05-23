const express = require("express");
const connection = require("./../database/mysql.js");
const jwt = require("jsonwebtoken");
const {generateAuthToken, findByCredential, authenticate, checkStadiumOwnerShip} = require("./../middleware/authenticate.js");



let router = express.Router();

router.get("/soccer_stadiums", function(req, res) {

	connection.query("select * from stadiums.images", function(err, result, fields) {
		if (err) {
			return console.log(err);
		}
		res.render("index", {stadiums:result});
		})
	});
	

router.post("/soccer_stadiums", authenticate, function(req, res){
	let name = req.body.name;
	let image = req.body.image;
	let price = req.body.price;
	let description = req.body.description;
	let location = req.body.location;
	console.log(image);

	let sql = "INSERT INTO stadiums.images(name, price, image, description, location, author) VALUES (?, ?, ?, ?, ?, ?)";
	connection.query(sql, [name, price, image, description, location, res.locals.currentUser], function(err) {
		if(err) {
			req.flash("error", err);
			return console.log(err);
		}
		req.flash("success", "You just added a new stadium!")
		res.redirect("/soccer_stadiums");
	});
	
})

//new
router.get("/soccer_stadiums/new", authenticate, function(req, res){
	res.render("new");
})

// connection.end(function(e) {
//     if (e) {
//       return console.log(e.message);
//     }
//   });
//show
router.get("/soccer_stadiums/:id", function(req, res) {
	let id = req.params.id;

	let sql = "select * from stadiums.images where ID = " + id;

	connection.query(sql, function(err, result, fields) {
		if (err) {
			req.flash("error", "Stadium not found!")
			return console.log(err);
		}
		//console.log(result[0]);
		sql = "select ID, author, text, img_ID from stadiums.comments where img_ID = "+id;
		connection.query(sql, function(err2, result2, fields2) {
			if(err2) {
				return console.log(err2);
			}
			res.render("show", {stadium:result[0], comments: result2});
		})
		})
		
	});

//edit
router.get("/soccer_stadiums/:id/edit", checkStadiumOwnerShip, function(req, res){
	let id = req.params.id;

	let sql = "select * from stadiums.images where ID = " + id;

	connection.query(sql, function(err, result, fields) {
		if (err) {
			req.flash("error", "Stadium not found!")
			return console.log(err);
		}
		res.render("edit", {stadium:result[0]});
	});
});

//update
router.put("/soccer_stadiums/:id", checkStadiumOwnerShip, function(req, res){
	let id = req.params.id;
	let sql = "update stadiums.images set name=?,price=?, image=?,description=?, location=? where ID = ?";

	connection.query(sql, [req.body.stadium.name, req.body.stadium.price, req.body.stadium.image, req.body.stadium.description, req.body.stadium.location, id], function(err, result, fields) {
		if (err) {
			req.flash("error", "Stadium not found!")
			return console.log(err);
		}
		req.flash("success", "Stadium updated!");
		res.redirect("/soccer_stadiums/"+id);
	});
})



//delete
router.delete("/soccer_stadiums/:id", checkStadiumOwnerShip, function(req, res){
	let id = req.params.id;
	let sql = "delete from stadiums.images where ID = ?";

	connection.query(sql, [id], function(err, result, fields) {
		if (err) {
			req.flash("error", "Stadium not found!")
			return console.log(err);
		}
		req.flash("error", "Stadium deleted!")
		res.redirect("/soccer_stadiums");
	});
})


module.exports = router;