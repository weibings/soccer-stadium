const express = require("express");
const connection = require("./../database/mysql.js");
const {generateAuthToken, findByCredential, authenticate, checkCommentOwnerShip} = require("./../middleware/authenticate.js");
const jwt = require("jsonwebtoken");

let router = express.Router();

//new comment
router.get("/soccer_stadiums/:id/comments/new", authenticate, function(req, res) {
	let id = req.params.id;
	console.log(id);
	let sql = "select * from images where ID = ?";

	connection.query(sql, id, function(err, result, fields) {
		if (err) {
			return console.log(err);
		}
		res.render("newComment", {stadium:result[0]});
		})
		
	});

router.post("/soccer_stadiums/:id/comments", authenticate, function(req, res) {
	let id = req.params.id;
	let sql = "insert into comments(author, text, img_ID) values(?, ?, ?)";
	connection.query(sql, [res.locals.currentUser, req.body.comment.text, id], function(err, result, fields) {
		if(err) {
			console.log(err);
			req.flash("error", err);
			res.redirect("/soccer_stadiums");
		}else{
			req.flash("success", "You just successfully posted a new comment!");
			res.redirect("/soccer_stadiums/"+id);
		}
	})


})

//edit
router.get("/soccer_stadiums/:id/comments/:comment_id/edit", checkCommentOwnerShip, function(req, res){
	let id = req.params.id;
	let comment_id = req.params.comment_id;

	let sql = "select * from comments where ID = ?";

	connection.query(sql, [comment_id], function(err, result, fields) {
		if (err) {
			req.flash("error", "Comment not found!")
			return console.log(err);
		}

		res.render("editComment", {comment:result[0]});
	});
})

//update
router.put("/soccer_stadiums/:id/comments/:comment_id", checkCommentOwnerShip, function(req, res) {
	let id = req.params.id;
	let comment_id = req.params.comment_id;

	let sql = "update comments set text=? where ID = ?";

	connection.query(sql, [req.body.comment.text, comment_id], function(err, result, fields) {
		if (err) {
			req.flash("error", "Comment not found!")
			return console.log(err);
		}
		req.flash("success", "Comment updated!");
		res.redirect("/soccer_stadiums/"+id);
	});
})

//delete
router.delete("/soccer_stadiums/:id/comments/:comment_id", checkCommentOwnerShip, function(req, res){
	let id = req.params.comment_id;
	let sql = "delete from comments where ID = ?";

	connection.query(sql, [id], function(err, result, fields) {
		if (err) {
			req.flash("error", "Comment not found!")
			return console.log(err);
		}
		req.flash("success", "Comment deleted!");
		res.redirect("/soccer_stadiums/"+req.params.id);
	});
})

module.exports = router;