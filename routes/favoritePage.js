const express = require("express");
const router = express.Router();
const path = require("path")

router.get('/favorites',(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/favorites.html"))
})

module.exports = router;