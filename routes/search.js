const express = require("express");
const router = express.Router();
const path = require("path")

router.get('/searchPage',(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/searchPage.html"))
})

module.exports = router;