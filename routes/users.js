var express = require("express");
var router = express.Router();
//Schema Setup
var User = require("../models/user")

//SHOW
router.get("/users/:id", function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("user/show", {user: foundUser});
        }
    })
});

module.exports = router;