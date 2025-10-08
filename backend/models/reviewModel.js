//Import npm package
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewTitle: {
    type: String,
    required: true,
  },
  reviewDescription: {
    type: String,
    required: true,
  },
  reviewRating: {
    type: Number,
    required: true,
  },
  // userName: {
  //   type: String,
  // },
  visitedCountry: {
    type: String,
    required: true,
  },
});

//Export module for use
module.exports = mongoose.model("review", reviewSchema);
