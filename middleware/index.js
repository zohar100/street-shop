var Shoe = require("../models/shoe");
var Comment = require("../models/comment")

var middleware = {};

middleware.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}

middleware.isAdmin= function(req, res, next){
    if(req.isAuthenticated() && req.user.isAdmin){
        return next();
    }else{
        req.flash("error", "You have no prommission to do that");
        res.redirect("/shop");
    }
}

middleware.commentUser = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentid, function(err, foundComment){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                //does user own the comment?
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    res.redirect("back")
                }
            }
});

    }else{ //otherwise redirect
        res.redirect("back");
    }

}

module.exports = middleware;