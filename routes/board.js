const express = require('express');
const { updateBoard,getBoard, deleteBoard, createBoard,getAllBoard } = require('../controllers/board.js');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();


//Create Board
router.post('/create',verifyToken,createBoard);
//Get Board
router.get('/get/:id',verifyToken,getBoard);
//Get All Board
router.get('/getall',verifyToken,getAllBoard);
//Update Board
router.put('/update/:id',verifyToken,updateBoard);
//Delete Board
router.delete('/delete/:id',verifyToken,deleteBoard);

module.exports = router;
