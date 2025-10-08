//GÖZDE
// Import libraries/modules
const express = require("express");

//Import controllers to be used
const continentController = require("../controllers/continentController");

// Create a router object using Express's Router method
const router = express.Router();

/*===============================*/
/*== Define routes for continent ==*/
/*===============================*/
router.get("/api/continents", continentController.getContinents);
router.get("/api/continents/:continentId", continentController.getCountryByContinent);
router.post("/api/continents", continentController.createContinent);
router.put("/api/continents", continentController.updateContinent);
router.delete("/api/continents", continentController.deleteContinent);


module.exports = router;
