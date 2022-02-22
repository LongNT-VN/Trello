const express = require('express');
const router = express.Router();
const {register,login} = require('../controllers/auth.js');


//Resgister
router.post('/register', register)
router.post('/login', login)

module.exports = router;