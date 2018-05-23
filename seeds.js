const connection = require("./database/mysql.js");

let data = [{
	name: "133",
	image: "https://images.unsplash.com/photo-1434648957308-5e6a859697e8?ixlib=rb-0.3.5&s=fc168e44f4306aec611dc8f476cd54a5&auto=format&fit=crop&w=800&q=60",
	description: "fgyhj",
	author: "bin"
},
{
	name: "213",
	image: "https://images.unsplash.com/photo-1505843687871-669c89088b12?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b0f9181d7c599c98445be94ac9eef7a6&auto=format&fit=crop&w=800&q=60",
	description: "afadfaj",
	author: "wei"
},
{
	name: "afadfa",
	image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-0.3.5&s=e78a2d4c50bda0a8e4312147498f5601&auto=format&fit=crop&w=800&q=60",
	description: "tyhiujok",
	author: "jinglin"
},

]

function seedDB() {
	//remove data
	connection.query("delete from stadiums.comments", function(err, result, fields){
		if (err){
			return console.log(err);
		}else{
			return console.log("remove all comments");
		}
	});
	connection.query("delete from stadiums.images", function(err, result, fields){
		if (err){
			console.log(err);
		}else {
		//added seveal stadiums
			console.log("remove all stadiums");
			data.forEach(function(stadium){
				connection.query("INSERT INTO stadiums.images(name, image, description, author) VALUES (?, ?, ?, ?)", [stadium.name, stadium.image, stadium.description, stadium.author], function(err, result1, field){
					if (err){
						console.log(err);
					}else{
						console.log("added a stadium");
						let author = "Homer";
						let text = "Bacon ipsum dolor amet shank turkey capicola buffalo, ball tip chicken salami alcatra pork chop. Bresaola turkey doner sirloin, landjaeger cupim jerky burgdoggen shoulder turducken. Ground round andouille t-bone shoulder sirloin. Turkey ham hock meatloaf short loin bresaola spare ribs. Short loin sausage drumstick turkey bresaola biltong. Bresaola strip steak tri-tip, tongue chicken swine hamburger pork loin shank frankfurter buffalo capicola alcatra doner. Biltong pork chop ribeye, boudin turkey ball tip chicken jowl tri-tip.";
						console.log(result1.insertId);
						connection.query("INSERT INTO stadiums.comments(author, text, img_ID) VALUES (?, ?, ?)", [author, text, result1.insertId], function(err2, result2, field2) {
							if (err2) {
								console.log(err2);
							}else{
								console.log("creaged new comment");
							}
						})
					}
				})
			})
		}
	});
};

module.exports = seedDB;

