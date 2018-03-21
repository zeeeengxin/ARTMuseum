var express = require("express"),
    app = express(), // app is an instance of express
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

// console.log(process.env.DATABASEURL);
//mongoose.connect("mongodb://localhost/yelp_camp"); // connect to local database
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// if process.env.DATABASEURL is not initialized, we setup a default one;
mongoose.connect(url); 
//mongoose.connect(process.env.DATABASEURL); // this can be improved with the above code
// also we can hide our database url
//"mongodb://zeng:zengxin@ds247619.mlab.com:47619/zengsdata"
//process.env.databaseURL // environment variable

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs"); // tell express to use ejs as templating engine and search ejs files in views folder
app.use(express.static(__dirname + "/public")); // __dirname is the path of current directory
//seedDB(); // fill the webpage with some testing campgrounds
app.use(methodOverride("_method")); // look for "_method"

app.use(flash());

// passport config
app.use(require("express-session")({
    secret: "Whatever you want to write",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // continue to do things, must add!
});
// will be called on every route
// same as add {currentUser: req.user} in every routes's render method
// for every route, you can just use currentUser
// been added to every template

app.use("/", indexRoutes); // no special prefix for url
app.use("/campgrounds", campgroundRoutes); // add "/campgrounds" in every route in campgroundRoutes
app.use("/campgrounds/:id/comments", commentRoutes);

//--------------------------
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The YelpCamp Server Has Started ..."); 
});