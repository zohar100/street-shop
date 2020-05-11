var mongoose = require("mongoose");

var shoeSchema = new mongoose.Schema({
    name: String,
    price: Number,
    color: [
        {type: String}
    ],
    image: String,
    imageId: String,
    description: String,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Shoe", shoeSchema);