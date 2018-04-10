var express 	= require("express");
var Museum 		= require("../models/museum");
var middleware 	= require("../middleware/index.js");
var router 		= express.Router();

// view all/specific museums
router.get("/", function(req, res) {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Museum.find({name: regex}, function(err, allMuseums) {
			if (err) {
				console.log(err);
				req.flash("error", "Error occurs, please try again later");
				res.redirect("back");
			} else {				
				if (allMuseums.length < 1) {
					req.flash("error", "Sorry, no museums matches your query. Please try again.");
					return res.redirect("/art_museum/museums");
				}
				res.render("museums/index", {museums: allMuseums, page: 'museums'});
			}
		});
	} else {
		Museum.find({}, function(err, allMuseums) {
			if (err) {
				console.log(err);
				req.flash("error", "Error occurs, please try again later");
				res.redirect("back");
			} else {
				res.render("museums/index", {museums: allMuseums, page: 'museums'});
			}
		});
	}	
});

// add new museum page
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("museums/new");
});
// add new museum post route
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name	= req.body.name,
		price 	= req.body.price,
		image 	= req.body.image,
		desc 	= req.body.description;
		author	= {
			id: req.user._id,
			username: req.user.username
		};
	var newMuseum = {name: name, price: price, image: image, description: desc, author: author};
	Museum.create(newMuseum, function(err, newlyCreated) {
		if (err) {
			console.log(err);
			req.flash("error", "Error occurs, please try again later");
			res.redirect("back");
		} else {
			res.redirect("/art_museum/museums");
		}
	});
});
// view individual museum's info
router.get("/:id", function(req, res) {
	Museum.findById(req.params.id).populate("comments").exec(function(err, foundMuseum) {
		if (err) {
			console.log(err);
			req.flash("error", "Error occurs, please try again later");
			res.redirect("back");
		} else if (!foundMuseum) {
			req.flash("error", "Museum not found");
			res.redirect("back");
		} else {
			res.render("museums/show", {museum: foundMuseum});
		}
	});
});
// edit museum page
router.get("/:id/edit", middleware.checkMuseumOwnership, function(req, res) {
    Museum.findById(req.params.id, function(err, foundMuseum) {
        res.render("museums/edit", {museum: foundMuseum});
    });
});
// museum info update route
router.put("/:id", middleware.checkMuseumOwnership, function(req, res) {
   Museum.findByIdAndUpdate(req.params.id, req.body.museum, function(err, updatedMuseum) {
        if(err) {
       		console.log(err);
        	res.redirect("/art_museum/museums");
        } else {
        	res.redirect("/art_museum/museums/" + req.params.id);
        }
   	}) ;
});
// delete museum route
router.delete("/:id", middleware.checkMuseumOwnership, function(req, res) {
    Museum.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
        	console.log(err);
            res.redirect("/art_museum/museums");
        } else {
            res.redirect("/art_museum/museums");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
