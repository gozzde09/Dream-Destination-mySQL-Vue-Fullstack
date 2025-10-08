
// Import libraries/modules
const express = require("express");

//Import controllers to be used
const countryController = require("../controllers/countryController");

// Create a router object using Express's Router method
const router = express.Router();

/*===============================*/
/*== Define routes for country ==*/
/*===============================*/

router.get("/api/countries", countryController.getCountries);  //Gözde
router.get("/api/countries/details", countryController.getCountriesWithDetails); //Gözde
router.get("/api/countries/:countryId",countryController.getCountryDetailsById); //Gözde
router.get("/api/countries/details/:countryname",countryController.getCountryDetailsByName); //Gözde

router.put("/api/countries/",countryController.updateExistingCountry); //För insomnia test
router.put("/api/countries/:countryId",countryController.updateExistingCountry); //Atko
router.post("/api/countries", countryController.createCountry); //Frida

router.delete("/api/countries", countryController.deleteCountry); //Frida För insomnia test
router.delete("/api/countries/:countryId", countryController.deleteCountryById); //Gözde

module.exports = router;
