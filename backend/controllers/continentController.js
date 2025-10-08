//GÖZDE
// Import the connection module for the MySQL database
const connectionMySQL = require("../connectionMySQL");

/*=============================*/
/*=== ENDPOINTS FOR CONTINENT ===*/
/*=============================*/

// GET endpoint to fetch continents
exports.getContinents = async (req, res) => {
  let sql = "SELECT * FROM continent";
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
// GET country by continent
exports.getCountryByContinent = async (req, res) => {
  const { continentId } = req.params;
  let sql = `
  SELECT * FROM continent
 JOIN country c ON continent.continentId = c.countryContinentId
 WHERE continent.continentId = ?;
`;
  try {
    await connectionMySQL.query(sql, [continentId], (error, results, fields) => {
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
// POST endpoint to add a new continent to the database
exports.createContinent = async (req, res) => {
  const { continentName } = req.body;

  const sql = "INSERT INTO continent (continentName) VALUES (?)";
  const params = [continentName];

  try {
    await connectionMySQL.query(sql, params);
    res.status(201).json({ success: true, message: "Continent has created!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating continent:" + error,
    });
  }
};

// PUT endpoint to update an existing continent
exports.updateContinent = async (req, res) => {
  const { continentName, continentId } = req.body;

  let sql = "UPDATE continent SET continentName = ? WHERE continentId = ?";
  let params = [continentName, continentId];

  // Validate incoming data (e.g., continent and continent ID)
  if (!continentName || continentName.trim().length < 1) {
    return res.status(400).json({
      success: false,
      error: "You have not entered a continent to add",
    });
  }
  if (!continentId) {
    return res.status(400).json({
      success: false,
      error: "You have not entered an ID for the continent you are updating!",
    });
  }

  try {
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
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// DELETE endpoint to delete a continent
exports.deleteContinent = async (req, res) => {
  const { continentId } = req.body;

  let sql = "DELETE FROM continent WHERE continentId = ?";
  if (!continentId) {
    return res.status(400).json({
      success: false,
      error: "You have not entered an ID for the continent you are deleting!",
    });
  }
   try {
     await connectionMySQL.query("DELETE FROM country WHERE countryContinentId = ?", [
       continentId,
     ]);
     // Radera rader från country-tabellen baserat på countryId
     await connectionMySQL.query("DELETE FROM continent WHERE continentId = ?", [
       continentId,
     ]);
     res.status(200).json({ success: true, message: "Continent has deleted!" });
   } catch (error) {
     res.status(500).json({
       success: false,
       error: "Error deleting continent:" + error,
     });
   }
};
