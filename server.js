require("dotenv").config();

const express = require("express");

var cors = require("cors");

const app = express();

app.use(cors());

app.use(express.static("public"));

const axios = require("axios")

const homepage = require('./routes/home')
const recipes = require("./routes/recipes")
const randomRecipesPage = require('./routes/randomRecipe')
const favoritesPage = require('./routes/favoritePage')
const search = require('./routes/search')
app.use("/",homepage);
app.use("/recipes",recipes);
app.use("/recipes",randomRecipesPage)
app.use("/recipes",favoritesPage)
app.use("/recipes",search)
// routing


app.use((req, res) => {
  res.status(404).send("Page not found <a href='/'>Get back home</a>");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});