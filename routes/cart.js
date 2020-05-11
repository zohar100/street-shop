var express = require("express"),
    router  = express.Router(),
    middleAware = require("../middleware");
var User    = require("../models/user");
var Shoe    = require("../models/shoe");

//Cart
router.get("/cart/:id", middleAware.isLoggedIn, function(req, res){
    User.findById(req.params.id).populate("cart").exec(function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            var totalPrice = 0;
            foundUser.cart.forEach(function(shoe){
                totalPrice += shoe.price;  
                return totalPrice;
            }); 
            res.render("user/cart", {user: foundUser, totalPrice: totalPrice});
        }
    });
});

//Add to cart
router.get("/cart/:id/:productid", middleAware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Shoe.findById(req.params.productid, function(err, foundShoe){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    foundUser.cart.push(foundShoe);
                    foundUser.save();
                    res.redirect("back");
                }
            });
        }
    });
});

//Delte from cart
router.get("/cart/:id/:productid/delete", function(req, res){
    User.findById(req.params.id , function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            var found = foundUser.cart.indexOf(req.params.productid);
            foundUser.cart.splice(found, 1);
            foundUser.save();
            res.redirect("/cart/"+ foundUser._id);
        }
    });
});

module.exports = router;