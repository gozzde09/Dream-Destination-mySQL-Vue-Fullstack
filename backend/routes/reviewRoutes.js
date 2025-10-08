
// Import npm package
const express = require("express");

//Import controller to be used
const reviewController = require("../controllers/reviewController");

// Create a router object using Express's Router method
const router = express.Router();



/*===============================*/
/*== Define routes for product ==*/
/*===============================*/


// Routes for category
router.get("/api/reviews", reviewController.getReviews); //Gözde
router.get('/api/reviews/:reviewId', reviewController.getSingleReview); //Atko

router.post("/api/reviews", reviewController.createReview); //Gözde
router.put("/api/reviews", reviewController.updateReview); //Frida
router.delete("/api/reviews", reviewController.deleteReviewById); //Atko

//Export for use
module.exports = router;
