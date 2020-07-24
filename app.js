const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const { stringify } = require('querystring');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Mongoose Implementation
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,useUnifiedTopology: true} );

// Schema
const userSchema= {
    email: String,
    password: String
}

// Model
const User = new mongoose.model("User", userSchema)

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
})
.post(function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if(err) {
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
})