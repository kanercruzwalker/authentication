const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
// Home Routes
app.route("/")
.get(function(req, res){
    res.render("home");
});

// Login Routes
app.route("/login")
.get(function(req, res){
    res.render("login");
});

// Register Routes
app.route("/register")
.get(function(req, res){
    res.render("register");
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
})