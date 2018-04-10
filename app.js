var express             = require('express'),
    app                 = express(), 
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    methodOverride      = require("method-override"),
    passport            = require("passport"),
    LocalStrategy       = require("passport-local"),
    User                = require("./models/user"),
    flash               = require("connect-flash");

var indexRoutes         = require("./routes/index"),
    museumRoutes        = require("./routes/museums"),
    commentRoutes       = require("./routes/comments");

// app config
app.locals.moment   = require("moment"),
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.use(express.static(__dirname + "/public"));
app.use(flash());

mongoose.connect("mongodb://localhost/museums");

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

// add flash for every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// routes
app.use("/", indexRoutes);
app.use("/museums", museumRoutes);
app.use("/museums/:id/comments", commentRoutes);

app.listen(5000, function() {
   console.log("The ARTMuseum Server Has Started ..."); 
});
