const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Connect to SQLite database
const db = new sqlite3.Database("./db/dua_main.sqlite");

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

app.get("/api/dua/:cat_id", async (req, res) => {
  const cat_id = req.params.cat_id;

  try {
    // Fetch subcategories for the given cat_id
    const subcategories = await getSubcategories(cat_id);

    // Fetch duas for the given cat_id
    const duas = await getDuas(cat_id);

    // Organize the data by subcategory
    const organizedData = organizeData(subcategories, duas);

    res.json(organizedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to get subcategories for a given cat_id
function getSubcategories(cat_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM sub_category WHERE cat_id = ${cat_id}`,
      (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      }
    );
  });
}

// Function to get duas for a given cat_id
function getDuas(cat_id) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM dua WHERE cat_id = ${cat_id}`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Function to organize data by subcategory
function organizeData(subcategories, duas) {
  const organizedData = [];

  subcategories.forEach((subcategory) => {
    const dataForSubcategory = {
      id: subcategory.id,
      cat_id: subcategory.cat_id,
      subcat_id: subcategory.subcat_id,
      subcat_name_en: subcategory.subcat_name_en,
      subcat_name_bn: subcategory.subcat_name_bn,
      categories: [],
    };

    const duasForSubcategory = duas.filter(
      (dua) => dua.subcat_id === subcategory.subcat_id
    );

    dataForSubcategory.categories = duasForSubcategory;

    organizedData.push(dataForSubcategory);
  });

  return organizedData;
}

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
