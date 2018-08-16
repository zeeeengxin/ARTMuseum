var Museum = require("../models/museum");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkMuseumOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Museum.findById(req.params.id, function(err, foundMuseum) {
            if(err) {
                req.flash("error", "Something went wrong, please try again later");
                res.redirect("back");
            } else if (!foundMuseum) {
                req.flash("error", "Museum not found");
                res.redirect("back");
            } else {
                if (foundMuseum.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to log in first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if(err) {
                req.flash("error", "Something went wrong, please try again later");
                res.redirect("back");
            } else if (!foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to log in first");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Please login first");
    res.redirect("/art_museum/login");
}

module.exports = middlewareObj;