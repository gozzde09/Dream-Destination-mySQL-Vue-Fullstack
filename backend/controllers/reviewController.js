
//Import model
const ReviewModel = require("../models/reviewModel");
/*=============================*/
/*=== ENDPOINTS FOR REVIEWS ===*/
/*=============================*/

//GET Gözde
exports.getReviews = async (req, res) => {
    try {
        const allReviews = await ReviewModel.find();
        return res.status(200).json(allReviews);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

// POST Endpoint to fetch all reviews
exports.createReview = async (req, res) => {
    try {
        const {
            reviewTitle,
            reviewDescription,
            reviewRating,
            visitedCountry,
        } = req.body;
        const insertedReview = await ReviewModel.create({
            reviewTitle,
            reviewDescription,
            reviewRating,
            visitedCountry,
        });
        return res.status(201).json(insertedReview);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// GET endpoint to fetch a specific review from DB by its ID (sent in from the adress, as parameter)
exports.getSingleReview = async (req, res) => {
    // Extract the review ID from request parameters
    const { reviewId } = req.params;

    try {
        // Find the review by its ID in the database
        const singleReview = await ReviewModel.findById(reviewId);

        // Return the found review as JSON response
        return res.status(200).json(singleReview);
    } catch (error) {
        // Handle any errors and return an error response
        return res.status(500).json({
            error: error.message
        });
    }
};

// POST for creating a new review -Gözde
exports.createReview = async (req, res) => {
    const {
        reviewTitle,
        reviewDescription,
        reviewRating,
        visitedCountry,
    } = req.body;

    try {
        const newReview = new ReviewModel({
            reviewTitle,
            reviewDescription,
            reviewRating,
            visitedCountry,
        });
        const insertedReview = await newReview.save();
        return res.status(201).json(insertedReview);
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

// PUT endpoint for altering existing review
exports.updateReview = async (req, res) => {
    // Extrahera data från den inkommande förfrågan
    const { reviewId, reviewTitle, reviewDescription, reviewRating,  visitedCountry } = req.body;

    try {
        // Uppdatera recensionen i databasen
        const updatedReview = await ReviewModel.findByIdAndUpdate(
            reviewId,
            { reviewTitle, reviewDescription, reviewRating, visitedCountry },
            { new: true } // Returnera den uppdaterade recensionen
        );

        if (!updatedReview) {
            // Om recensionen inte hittades, returnera en felstatus
            return res.status(404).json({ success: false, error: 'Recensionen hittades inte' });
        }

        // Om uppdateringen lyckades, returnera en framgångsstatus och den uppdaterade recensionen
        return res.status(200).json({ success: true, updatedReview });
    } catch (error) {
        // Hantera eventuella fel och returnera en felstatus
        return res.status(500).json({ success: false, error: error.message });
    }
};


// DELETE endpoint to delete a review by its ID (sent in the request body) -Atko
exports.deleteReviewById = async (req, res) => {
    // Extract review ID from request body
    const { reviewId } = req.body;

    try {
        // Find the review by its ID in the database and delete it
        const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

        // If review is not found, return a 404 response
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review ID not found' });
        }

        // Return the deleted review as JSON response
        res.status(200).json({ success: true, message: "The review was deleted!" });
    } catch (error) {
        // Handle any errors and return an error response
        return res.status(500).json({ error: error.message });
    }
};
