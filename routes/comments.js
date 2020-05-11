var express = require("express"),
    router  = express.Router();
var middleAware = require("../middleware")
var Comment = require("../models/comment");
var Shoe = require("../models/shoe")


//CREATE
router.post("/shop/:id/comments", middleAware.isLoggedIn, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Comment.create(req.body.comment, function(err, createdComment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundShoe.comments.push(createdComment);
                    foundShoe.save();
                    res.redirect("/shop/" + foundShoe._id);
                }
            });
        }
    });
});

//EDIT
router.get("/shop/:id/comments/:commentid/edit", middleAware.commentUser, function(req, res){
    Comment.findById(req.params.commentid, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("comment/edit", {product_id: req.params.id ,comment: foundComment});
        }
    });
});

//UPDATE
router.put("/shop/:id/comments/:commentid", middleAware.commentUser, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/shop/"+ req.params.id);
        }
    });
});

//DESTROY
router.delete("/shop/:id/comments/:commentid", middleAware.commentUser, function(req, res){
    Comment.findByIdAndRemove(req.params.commentid, function(err, deletedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("/shop/"+req.params.id)
        }
    });
});

module.exports = router;