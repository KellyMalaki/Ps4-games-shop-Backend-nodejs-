var mongoose = require("mongoose");
var schema = mongoose.Schema;

var game = new schema({
    title: String,
    price: Number,
    rating: Number,
    year: Number,
    cover: String
});

module.exports = mongoose.model("Game", game);