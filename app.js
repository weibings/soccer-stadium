const express = require('express');
const bodyParser = require('body-parser');
const connection = require("./database/mysql.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const router = require('./routes/soccer_stadiums.js');
const soccer_stadiums = require("./routes/soccer_stadiums.js");
const comments = require("./routes/comments.js");
const index = require("./routes/index.js");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require('express-session');
require('./config/config.js');

//const seedDB = require("./seeds.js");


const port = process.env.PORT;
let app = express();
let sessionStore = new session.MemoryStore;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}));
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));


app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	console.log("hello");
	// let token = req.cookies.auth;
	// if(!token) {
	// 	console.log("hi");
	// 	res.locals.currentUser = '';
	// 	return next();
	// }
	// try{
	// 	console.log("haha");
 //     	let decoded = jwt.verify(token, process.env.JWT_SECRET);
	//   	res.locals.currentUser = decoded.username;
	// }catch(e){
	//   	return console.log(e);
	// }
	next();
})

app.use(soccer_stadiums);
app.use(comments);
app.use(index);

//seedDB();
app.listen(port, function(){
	console.log("connected");
})