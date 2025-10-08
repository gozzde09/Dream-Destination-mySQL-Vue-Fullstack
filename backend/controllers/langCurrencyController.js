//GÖZDE
// Import the connection module for the MySQL database
const connectionMySQL = require("../connectionMySQL");

/*=============================*/
/*=== ENDPOINTS FOR LANGUAGE and CURRENCY===*/
/*=============================*/

// GET endpoint to fetch languages
exports.getLanguages = async (req, res) => {
  let sql = "SELECT * FROM language";
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

// POST endpoint to add a new language to the database
exports.createLanguage = async (req, res) => {
  const { languageName } = req.body;

  const sql = "INSERT INTO language (languageName) VALUES (?)";
  const params = [languageName];

  try {
    await connectionMySQL.query(sql, params);
    res.status(201).json({ success: true, message: "Language has created!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating language:" + error,
    });
  }
};

// GET endpoint to fetch currency
exports.getCurrencies = async (req, res) => {
  let sql = "SELECT * FROM currency";
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
// POST endpoint to add a new currency to the database
exports.createCurrency = async (req, res) => {
  const { currencyName, currencyAcronym } = req.body;

  const sql = "INSERT INTO currency (currencyName, currencyAcronym) VALUES (?, ?)";
  const params = [currencyName,currencyAcronym];
  try {
    await connectionMySQL.query(sql, params);
    res.status(201).json({ success: true, message: "Currency has created!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating currency:" + error,
    });
  }
};
