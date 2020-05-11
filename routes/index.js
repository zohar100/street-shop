var passport = require("passport"),
    express = require("express"),
    router  = express.Router();
//SCHEMA SETUP
var User = require("../models/user");

router.get("/", function(req, res){
    res.redirect("/shop");
});

//NEW
router.get("/register", function(req, res){
    res.render("register");
});

//CREATE
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    if(req.body.admincode === "admin123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, createdUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/shop");
            });
        }
    });
});

//Login form
router.get("/login", function(req, res){
    res.render("login");
});

//Login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/shop",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout logic
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged you out");
    res.redirect("/shop");
});

//DESTROY
router.delete("/delete/:id", function(req, res){
    User.findByIdAndRemove(req.params.id, function(err, deletedUser){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.redirect("back");
        }
    });
});

module.exports = router;