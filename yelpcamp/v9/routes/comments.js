var express = require("express"),
    router = express.Router({mergeParams: true}),
	Campground = require("../models/campground"),
	Comment = require("../models/comment");

// ====== NEW ==========
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// ========= CREATE ===========
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
			   comment.author._id = req.user._id;
			   comment.author.username = req.user.username;
			   comment.save();
			   campground.comments.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// ======= MIDDLEWARE =========
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} 
	res.redirect("/login");
}

module.exports = router;