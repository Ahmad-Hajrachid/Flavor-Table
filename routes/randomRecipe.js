const express = require("express");
const router = express.Router();
const path = require("path")

router.get('/randomrecipe',(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/randomRecipes.html"))
})

module.exports = router;