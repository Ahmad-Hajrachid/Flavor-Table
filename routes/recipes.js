const express = require('express');
const router = express.Router();
const axios = require("axios");

const key = process.env.SECRET_KEY;

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

module.exports = router;
