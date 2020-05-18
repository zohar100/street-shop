var express = require("express");
var router = express.Router();
var middleAware = require("../middleware");
var Shoe = require("../models/shoe");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'zohardevspace', 
  api_key: '561569338755957', 
  api_secret: process.env.CLOUDINARY_SECRET_API
});

//TYPE
router.get("/shop", function(req, res){
    Shoe.find({}, function(err, foundshoes){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("shop/index", {product: foundshoes, page: "shop"});   
        }
    });
});

//NEW
router.get("/shop/new", middleAware.isAdmin, function(req, res){
    res.render("shop/new");
});

//CREATE
router.post("/shop", middleAware.isAdmin, upload.single('image'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if(err){
            console.log(err);
        }
        var newShoe = {
            name: req.body.shoe.name, 
            image: result.secure_url,
            imageId: result.public_id,
            price: req.body.shoe.price,
            color: req.body.shoe.color, 
            description: req.body.shoe.description
        };
    
        Shoe.create(newShoe, function(err, createdShoe){
            if(err){
                console.log(err);
                res.redirect("back");
            }else{
                console.log(createdShoe);
                res.redirect("/shop");
            }
        });
    });
});

//SHOW
router.get("/shop/:id", function(req, res){
    Shoe.findById(req.params.id).populate("comments likes").exec(function(err, foundShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("shop/show", {product: foundShoe, page: "shop"});
        }
    });
});

//EDIT 
router.get("/shop/:id/edit", middleAware.isAdmin, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            res.render("shop/edit", {product: foundShoe});
        }
    });
});

//UPDATE
router.put("/shop/:id",middleAware.isAdmin, upload.single('image'), function(req, res){
    Shoe.findById(req.params.id, async function(err, updatedShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            if(req.file) {
                try{
                    await cloudinary.v2.uploader.destroy(updatedShoe.imageId);
                    var result = await cloudinary.v2.uploader.upload(req.file.path);
                    updatedShoe.imageId = result.public_id;
                    updatedShoe.image = result.secure_url;
                }catch(err){
                    console.log(err);
                    return res.redirect("back");
                }
            }
                color = req.body.product.color; 
                updatedShoe.name = req.body.product.name;
                updatedShoe.price = req.body.product.price;
                updatedShoe.description = req.body.product.description;
                if(!color){
                    updatedShoe.color = [""];
                }
                updatedShoe.color = color;
                updatedShoe.save();
                res.redirect("/shop/"+ req.params.id);
            }
    });
});

//DESTROY
router.delete("/shop/:id",middleAware.isAdmin, function(req, res){
    Shoe.findById(req.params.id, async function(err, deletedShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            try{
                await cloudinary.v2.uploader.destroy(deletedShoe.imageId);
                deletedShoe.remove();
                req.flash("success", "Shoe deleted successfully!");
                res.redirect("/shop");
            }catch(err){
                res.redirect("back");
            }
        }
    });
});

//Likes route
router.post("/shop/:id/like", middleAware.isLoggedIn, function(req, res){
    Shoe.findById(req.params.id, function(err, foundShoe){
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            //chek if user exist in shoes likes
            var foundShoeLike = foundShoe.likes.some(function(like){
                return like.equals(req.user._id)
            });
            //if user like remove like
            if(foundShoeLike){
                foundShoe.likes.pull(req.user);
            }//else add user like
            else{
                foundShoe.likes.push(req.user);
            }
            foundShoe.save(function(err){
                if(err){
                    console.log(err);
                    res.redirect("back");
                }else{
                    res.redirect("back");
                }
            })
        }
    });
});

module.exports = router;