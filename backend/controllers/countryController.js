// Import the connection module for the MySQL database
const connectionMySQL = require("./../connectionMySQL");

/*=============================*/
/*=== ENDPOINTS FOR COUNTRY ===*/
/*=============================*/

// GET endpoint to fetch all seasons from the database -Gözde
exports.getCountries = async (req, res) => {
  let sql = "SELECT * FROM country";
  try {
    await connectionMySQL.query(sql, (error, results, fields) => {
      if (error) {
        if (error) throw error;
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

//Skapade en view för att visa alla data från alla tabellerden -Gözde
exports.getCountriesWithDetails = async (req, res) => {
  let sql = "SELECT * FROM viewCountryDetails";

  try {
    await connectionMySQL.query(sql, (error, results, fields) => {
      if (error) {
        if (error) throw error;
      }
      res.json(results);
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
//GET a country with details by ID -Gözde
exports.getCountryDetailsById = async (req, res) => {
  const { countryId } = req.params;
  let sql = "SELECT * FROM viewCountryDetails WHERE countryId = ?";
  try {
    connectionMySQL.query(sql, [countryId], (error, results) => {
      if (error) {
        console.error("MySQL query error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Not Found" });
      }
      res.json(results[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" + error });
  }
};

//GET a country with details by NAME -Gözde
exports.getCountryDetailsByName = async (req, res) => {
  const { countryname } = req.params;
  let sql = `SELECT * FROM  viewCountryDetails WHERE countryName = ?`;
  try {
    connectionMySQL.query(sql, [countryname], (error, results) => {
      if (error) {
        console.error("MySQL query error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Not Found" });
      }
      res.json(results[0]);
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" + error });
  }
};


// PUT endpoint to update an existing season in the database - Atko
exports.updateExistingCountry = async (req, res) => {
  // Extract data from the incoming request
  const { countryName, countryPopulation, countryId } = req.body;

  // SQL query to update an existing country in the database
  let sql =
    "UPDATE country SET countryName = ?, countryPopulation=? WHERE countryId = ?";
  let params = [countryName, countryPopulation, countryId];

  // Validate incoming data (e.g., country and country ID)
  if (!countryName || countryName.trim().length < 1) {
    return res.status(400).json({
      success: false,
      error: "You have not entered a country to add",
    });
  }

  if (!countryId) {
    return res.status(400).json({
      success: false,
      error: "You have not entered an ID for the country you are updating!",
    });
  }

  try {
    // Execute the SQL query against the database with the incoming data and return a success message as JSON
    await connectionMySQL.query(sql, params, (error, results, fields) => {
      if (error) {
        throw error;
      }
      return res.status(201).json({
        success: true,
        error: "",
      });
    });
  } catch (error) {
    // Handle any errors by returning an error status and message as JSON
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// POST endpoint to add a new country to the database - Frida
exports.createCountry = async (req, res) => {
  const {
    countryName,
    countryDescription,
    countryCapital,
    countryPopulation,
    countryContinentId,
    countryLanguageId,
    countryCurrencyId,
  } = req.body;

  // SQL-query för att skapa ett nytt land i databasen
  const sql =
    "INSERT INTO country (countryName, countryDescription, countryCapital, countryPopulation, countryContinentId, countryLanguageId, countryCurrencyId) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const params = [
    countryName,
    countryDescription,
    countryCapital,
    countryPopulation,
    countryContinentId,
    countryLanguageId,
    countryCurrencyId,
  ];

  try {
    await connectionMySQL.query(sql, params);
    res.status(201).json({ success: true, message: "Landet har skapats!" });
  } catch (error) {
    console.log("Response:", response);
    res.status(500).json({
      success: false,
      error: "Ett fel uppstod vid skapandet av landet." + error,
    });
  }
};


// DELETE endpoint to delete a season from the database - Frida
exports.deleteCountry = async (req, res) => {
  const { countryId } = req.body;

  // SQL-query för att radera ett land baserat på ID
  let sql = "DELETE FROM country WHERE countryId = ?";
  if (!countryId) {
    return res.status(400).json({
      success: false,
      error: "Du har inte skrivit in något ID för country du ska radera!",
    });
  }
  try {
    await connectionMySQL.query(sql, [countryId]);
    res.status(200).json({ success: true, message: "Landet har raderats!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting country:" + error,
    });
  }
};

// DELETE a country by Id -Gözde
exports.deleteCountryById = async (req, res) => {
  const { countryId } = req.params;

  if (!countryId) {
    return res.status(400).json({
      success: false,
      error: "Du har inte skrivit in något ID för landet du ska radera!",
    });
  }

  try {
    // Radera rader från city-tabellen som refererar till det angivna countryId
    await connectionMySQL.query("DELETE FROM city WHERE cityCountryId = ?", [
      countryId,
    ]);
    // Radera rader från country-tabellen baserat på countryId
    await connectionMySQL.query("DELETE FROM country WHERE countryId = ?", [
      countryId,
    ]);

    res.status(200).json({ success: true, message: "Landet har raderats!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting country:" + error,
    });
  }
};
