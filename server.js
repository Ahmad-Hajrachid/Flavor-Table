require("dotenv").config();

const express = require("express");

var cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const pg = require('pg')
// const client = new pg.Client(process.env.DATABASE_URL);
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// routing
const homepage = require('./routes/home')
const recipesRouter = require("./routes/recipes")
const randomRecipesPage = require('./routes/randomRecipe')
const favoritesPage = require('./routes/favoritePage')
const search = require('./routes/search')
app.use("/",homepage);
app.use("/recipes",recipesRouter);
app.use("/recipes",randomRecipesPage)
app.use("/recipes",favoritesPage)
app.use("/recipes",search)


app.use((req, res) => {
  res.status(404).send("Page not found <a href='/'>Get back home</a>");
});


const port = process.env.PORT || 3000;


// connecting the db
pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;

        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );

        console.log(`App listening on port http://localhost:${port}`);
      });
  })
  .then(() => {
    app.listen(port);
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });