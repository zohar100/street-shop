var express = require("express");
var router  = express.Router();
var middleAware = require("../middleware");
var paypal = require("paypal-rest-sdk");
var User    = require("../models/user");
var Shoe    = require("../models/shoe");

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AUN6mxOAFtJS5hrlUGdyd-Fe1VOE6zu63W6dYztXhOXOpeT0ps9JbF9N3lII-f3EP1o7G2MHs9flc3Ho',
    'client_secret': process.env.PAYPAL_SECRET_API
  });

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

//pay with paypal
router.post("/cart/:id/pay", function(req, res){
    User.findById(req.params.id).populate("cart").exec(function(err, foundUser){
        if(err){
            console.log(err);
            res.redirect("back")
        }else{
            //find all shoes to checkout
            var newItems = [];
            for(var i=0;i < foundUser.cart.length;i++){
                itemToPush = {
                    "name": foundUser.cart[i].name,
                    "sku": foundUser.cart[i].length,
                    "price": foundUser.cart[i].price,
                    "currency": "USD",
                    "quantity": 1
                }
                newItems.push(itemToPush);
            }
            //totalprice
            var totalPrice = 0;
            foundUser.cart.forEach(function(item){
                    totalPrice += item.price;  
                    return totalPrice;
            }); 
            res.redirect("back");
            // create paypal payment JSON
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    //check problem!!!!!!!!!!
                    "return_url": "http://127.0.0.1:3000/shop",
                    "cancel_url": "http://127.0.0.1:3000/shexpoop"
                },
                "transactions": [{
                    "item_list": {
                        "items": newItems
                    },
                    "amount": {
                        "currency": "USD",
                        "total": totalPrice
                    },
                    "description": "This is the payment description."
                }]
            };
            // console.log(JSON.stringify(create_payment_json));
            paypal.payment.create(create_payment_json, function(err, payment){
                if(err){
                    throw err;
                }else{
                    console.log(payment);
                    for(var i=0;i < payment.links.length;i++){
                        if(payment.links[i].rel === 'approval_url'){
                            console.log("FOUND " + payment.links[i].href);
                            res.redirect(payment.links[i].href);
                        }
                    }
                }
            });
        }
    });
});

module.exports = router;