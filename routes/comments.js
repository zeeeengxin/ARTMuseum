
// ======================
// comment routes
// ======================

var express = require("express");
var router = express.Router({mergeParams: true}); // to access parent route's params e.i. camground_id
var Campground = require("../models/campground"); // include the models
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function (req, res) {
// req.param.id is not passed in, so we need express.Router({mergeParams: true})
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
       }  else {
           res.render("comments/new", {campground : campground});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, newComment) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    newComment.author.id = req.user._id; // because you've logged in
                    // we can get your id by req.user.xxx
                    newComment.author.username = req.user.username;
                    newComment.save();
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success", "Successfully create comment");
                    res.redirect("/campgrounds/" + campground._id);
                    // can't just write "/campgrounds/:id"... not meaningful
                }
            });
        }
    });
});

// comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        // we need make sure that both campgroundid and comment id are valid
        // comment id was checked in middleware
        if (err || !foundCampground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
               res.redirect("back");
            }  else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// comment update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
   Comment.findByIdAndRemove(req.params.comment_id, function(err) {
       if (err) {
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});


module.exports = router;
