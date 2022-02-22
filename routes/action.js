const express = require('express');
const { updateAction,getAction, getActions,deleteAction, createAction } = require('../controllers/action.js');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();


//Create Action
router.post('/create',verifyToken,createAction);
//Get Action
router.get('/get/:id',verifyToken,getAction);
//Get all
router.get('/getAll',verifyToken,getActions);
//Update Action
router.put('/update/:id',verifyToken,updateAction);
//Delete Action
router.delete('/delete/:id',verifyToken,deleteAction);

module.exports = router;
