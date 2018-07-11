const express = require("express");
const app	  = express();
const axios   = require("axios");
/*const d3 	  = require("d3");*/
/*var graphfunctions = require("./public/assets/graphfunctions.js");*/


app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

app.get("/", function(req, res){
	res.render("index");
});



app.listen(8080, function(){
    console.log("Server has started!!!");
});