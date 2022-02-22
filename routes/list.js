const express = require('express');
const { updateList,getLists, deleteList, createList } = require('../controllers/list.js');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();


//Create List
router.post('/create',verifyToken,createList);
//Get List
router.get('/get/:id',verifyToken,getLists);
//Update List
router.put('/update/:id',verifyToken,updateList);
//Delete List
router.delete('/delete/:id',verifyToken,deleteList);

module.exports = router;
