//GÖZDE
// Import libraries/modules
const express = require("express");

//Import controllers to be used
const langCurrencyController = require("../controllers/langCurrencyController");

// Create a router object using Express's Router method
const router = express.Router();

/*===============================*/
/*== Define routes for continent ==*/
/*===============================*/
router.get("/api/languages", langCurrencyController.getLanguages);
router.get("/api/currencies", langCurrencyController.getCurrencies);

router.post("/api/languages", langCurrencyController.createLanguage);
router.post("/api/currencies", langCurrencyController.createCurrency);
module.exports = router;
