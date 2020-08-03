require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { stringify } = require('querystring');

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

// Creating Session
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

// Initializing Passport
app.use(passport.initialize());
app.use(passport.session());


// Mongoose Implementation
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true,useUnifiedTopology: true, useCreateIndex: true} );

// Schema
const userSchema= new mongoose.Schema ({
    email: String,
    password: String
});

// Enable passport-local-mongoose
userSchema.plugin(passportLocalMongoose);

// Model
const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })

});

// Register Routes
app.route("/register")
.get(function(req, res){
    res.render("register");
})
.post(function(req, res){

    // Passport Session on Register
    User.register({username: req.body.username}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    });
});

app.route("/secrets")
.get(function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.route("/logout")
.get(function(req,res){
    req.logout();
    res.redirect("/");
});


app.listen(3000, function() {
    console.log("Server started on port 3000");
})