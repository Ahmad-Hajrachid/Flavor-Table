const express = require('express');
const router = express.Router();
const axios = require("axios");
const pg = require('pg')
const key = process.env.SECRET_KEY;
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.get("/random", async (req, res) => {
  try {
    
    const response = await axios.get("https://api.spoonacular.com/recipes/random", {
      params: {
        apiKey: key,
        number: 5,
      },
    });

    res.json(response.data.recipes);
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});


router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    const response = await axios.get(`https://api.spoonacular.com/recipes/findByIngredients`, {
      params: {
        ingredients:query,
        apiKey: key,
        number: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// router for the get all query
router.get('/showAll', async (req, res)=>{
  try {
    const result = await pool.query("SELECT * FROM recipes");
    res.json(result.rows);
  }catch(error){
    res.status(500).send("Error fetching recipes")
  }
});

// Router for the get for one
router.get('/showOne/:id', async (req, res) => {
  const id = Number(req.params.id); // ensure it's a number

  try {
    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Recipe not found" }); // ✅ return JSON
    }

    res.json(result.rows[0]); // ✅ return recipe as JSON
  } catch (error) {
    console.error("Error fetching recipe:", error);
    res.status(500).json({ error: "Error fetching recipe" }); // ✅ return error as JSON
  }
});

router.post("/add", async (req, res) => {
  const { title, image, instructions, ingredients, readyin } = req.body;

  try {
    const existingRecipe = await pool.query(
      "SELECT id FROM recipes WHERE title = $1",
      [title]
    );

    
    if (existingRecipe.rows.length > 0) {
      return res.status(409).json({
        error: "Recipe already exists in database",
        id: existingRecipe.rows[0].id
      });
    }

    const result = await pool.query(
      "INSERT INTO recipes (title, image, instructions, ingredients, readyin) VALUES ($1, $2, $3, $4 ,$5) RETURNING *",
      [title, image, instructions, JSON.stringify(ingredients), readyin]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).send("Error");
  }
});

router.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { title, image, instructions, ingredients, readyin } = req.body;

  try {
    const result = await pool.query(
      "UPDATE recipes SET title=$1, image=$2, instructions=$3, ingredients=$4, readyin=$5 WHERE id=$6 RETURNING *",
      [title, image, instructions, JSON.stringify(ingredients), readyin, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).send("Error");
  }
});


router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM recipes WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send("Error");
  }
});


module.exports = router;
