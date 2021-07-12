var mongoose = require("mongoose");
var Shoe = require("./models/shoe");
var Comment    = require("./models/comment")

var data =[
    {
        color:["black","white","yellow"],
        likes:[],
        comments:[],
        name:"Color-blocking Breathable Mesh Sport Sneakers ",
        image:"https://res.cloudinary.com/zohardevspace/image/upload/v1589122756/blouuxdfsobdzgjwak1q.png",
        imageId:"blouuxdfsobdzgjwak1q",
        price:45,
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },

    {
        color:["black","white","yellow"],
        likes:[],
        comments:[],
        name:"Color-blocking Outdoor Platform Sneakers",
        image:"https://res.cloudinary.com/zohardevspace/image/upload/v1589122851/wyzl6c0x2rgpq1olqgb1.png",
        imageId:"wyzl6c0x2rgpq1olqgb1",
        price:54,
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },

    {
        color:["black","white","yellow"],
        likes:[],
        comments:[],
        name:"Color-blocking Casual Dad Sneakers",
        image:"https://res.cloudinary.com/zohardevspace/image/upload/v1589122951/vna2srxqfxc2lzgkmja1.png",
        imageId:"vna2srxqfxc2lzgkmja1",
        price:55,
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    },
    {
        color:["black","white","yellow"],
        likes:[],
        comments:[],
        name:"Color-blocking Breathable Mesh Sport Sneakers ",
        image:"https://res.cloudinary.com/zohardevspace/image/upload/v1589808144/tlsq1m2tuiruo1nmnxiw.png",
        imageId:"tlsq1m2tuiruo1nmnxiw",
        price:45,
        description:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
    }
]

function seedDB(){
    //Remove all Shoes
    Shoe.deleteMany({}, function(){
        console.log('Shoe removed successfuly')
    });
    Comment.deleteMany({}, function(){
        console.log('Comment removed successfuly')
    });
    data.forEach(function(shoe) {
        Shoe.create(shoe, function(){
            console.log('show added');
        });
    });


 }

 module.exports = seedDB;