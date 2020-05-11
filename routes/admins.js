var express = require("express");
var router = express.Router();
var middleAware = require("../middleware")
//Schema Setup
var User = require("../models/user");
var Shoe = require("../models/shoe");

//TYPE
router.get("/admin", middleAware.isAdmin, function(req, res){
    Shoe.find({}, function(err, foundShoes){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            User.find({}, function(err, foundUsers){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.render("admin/index", {product: foundShoes, user: foundUsers});
                }
            });
        }
    });
});


module.exports = router; 