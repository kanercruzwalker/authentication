require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
const userSchema= new mongoose.Schema ({
    email: String,
    password: String
});

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
})
.post(function(req, res){
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, function(err, foundUser){
        if (err){
            console.log(err);
        }else {
            if (foundUser) {
                if (foundUser.password === password){
                    res.render("secrets")
                }
            }
        }
    })

});

// Register Routes
app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){

    // where the final hash is generated 
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err) {
                console.log(err);
            }else{
                res.render("secrets");
            }
        });
    
    });


});


app.listen(3000, function() {
    console.log("Server started on port 3000");
})