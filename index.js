const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("./db/dua_main.sqlite");

// const query = "SELECT name FROM sqlite_master WHERE type='table';";

// // Execute the query
// db.all(query, (err, tables) => {
//   if (err) {
//     console.error(err);
//   } else {
//     // Extract table names from the result
//     const tableNames = tables.map((table) => table.name);

//     // Log the table names
//     console.log("Tables:", tableNames);
//   }

//   // Close the database connection
//   db.close();
// });

// Define your API endpoints here
app.get("/api/dua", (req, res) => {
  db.all("SELECT * FROM dua", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});
// Get Category and SubCategory Wise Dua
app.get("/api/dua/:cat_id/:subcat_id", (req, res) => {
  const cat_id = req.params.cat_id;
  const subcat_id = req.params.subcat_id;
  db.all(
    `SELECT * FROM dua WHERE cat_id = ${cat_id} AND subcat_id = ${subcat_id}`,
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(rows);
      }
    }
  );
});
app.get("/api/category", (req, res) => {
  db.all("SELECT * FROM category", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// Get All Sub Category
app.get("/api/sub_category", (req, res) => {
  db.all("SELECT * FROM sub_category", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// Get Category wise, Sub Category
app.get("/api/sub_category/:cat_id", (req, res) => {
  const cat_id = req.params.cat_id;
  db.all(`SELECT * FROM sub_category WHERE cat_id = ${cat_id}`, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
