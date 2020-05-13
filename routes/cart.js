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

//Add and delete from cart
router.get("/cart/:id/:shoeid", middleAware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            Shoe.findById(req.params.shoeid, function(err, foundShoe){
                ShoeIsInCart = foundUser.cart.some(function(shoe){
                    return shoe.equals(foundShoe._id);
                });
                if(ShoeIsInCart){
                    foundUser.cart.pull(foundShoe);
                }else{
                    foundUser.cart.push(foundShoe);
                }
                foundUser.save(function(err){
                    if(err){
                        console.log(err);
                        res.redirect("back");
                    }
                    res.redirect("back");
                });
            });
        }
    });
});

module.exports = router;