const bcrpyt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const pg = require('pg');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const routeGuard = require('../middleware/verifyToken');



router.post('/register', async (req,res)=>{
     const { username, email, password} = req.body;

  try {
    //Hash the password:
    const hashedPassword = await bcrpyt.hash(password,10);//10 is the number of attemps of hashing.

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id,username,email", //the returning is for the postman check. we dont need it usually
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if(error.code === '23505'){ // to check if the unique is not being duplicated again.
        res.status(409).send("Username or Email already in use.");
    }
    res.status(500).send("Error");
  }
});


router.post('/login',async (req,res)=>{
    const {email, password} = req.body;

    try{
        const userResult = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        const user = userResult.rows[0];
        if(!user){
            return res.status(404).send("User does not exist.")
        }
        const isMatched = await bcrpyt.compare(password , user.password);
        if(!isMatched){
            return res.status(401).send("Incorrect Credentials")
        }
        const token = jwt.sign(
            {
                id:user.id ,
                email: user.email
            },
            process.env.JWT_SECRET,
            {expiresIn:'2h'}
        );

        res.send({token})
    } catch (error){
        console.log("Error logging in",error);
        res.status(500).send("Error",error.message);
    }
})

router.get('/profileData', routeGuard, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            'SELECT username, email FROM users WHERE id = $1',
            [userId]
        );
        const user = result.rows[0];
        res.json(user);
    } catch (err) {
        res.status(500).send("Failed to load profile");
    }
});


module.exports = router;