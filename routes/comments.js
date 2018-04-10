var express 	= require("express");
var router 		= express.Router({mergeParams: true});
var Museum 		= require("../models/museum"); // include the models
var Comment 	= require("../models/comment");
var middleware 	= require("../middleware/index.js");

// new comment form page
router.get("/new", middleware.isLoggedIn, function(req, res) {
	Museum.findById(req.params.id, function(err, museum) {
		if (err) {
			console.log(err);
			req.flash("error", "Something went wrong, please try again later");
			res.redirect("/art_museum/museums/" + req.params.id);
		} else {
			res.render("comments/new", {museum : museum});
		}
	});
});
// new comment post route
router.post("/", middleware.isLoggedIn, function(req, res) {
    Museum.findById(req.params.id, function(err, museum) {
        if (err) {
            console.log(err);
            req.flash("error", "Something went wrong, please try again later");
            res.redirect("/art_museum/museums");
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    req.flash("error", "Something went wrong, please try again later");
                    console.log(err);
                    res.redirect("/art_museum/museums");
                } else {
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    museum.comments.push(newComment);
                    museum.save();
                    req.flash("success", "Successfully created comment");
                    res.redirect("/art_museum/museums/" + museum._id);
                }
            });
        }
    });
});
// show comment edit page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Museum.findById(req.params.id, function(err, foundMuseum) {
        if (err) {
        	console.log(err);
        	req.flash("error", "Something went wrong, please try again later");
            return res.redirect("back");
        } else if (!foundMuseum) {
            req.flash("error", "No museum found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
            	console.log(err);
            	req.flash("error", "Something went wrong, please try again later");
                res.redirect("back");
            }  else {
                res.render("comments/edit", {museum_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
        	console.log(err);
            req.flash("error", "Something went wrong, please try again later");
            res.redirect("back");
        } else {
            res.redirect("/art_museum/museums/" + req.params.id);
        }
    });
});

// comment delete route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
       		console.log(err);
            req.flash("error", "Something went wrong, please try again later");
            res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/art_museum/museums/" + req.params.id);
       }
   }); 
});

module.exports = router;
