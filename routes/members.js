const express = require('express');
const { updateMember,getMember, deleteMember } = require('../controllers/member.js');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();

//Update member
router.put('/update/:id',verifyToken,updateMember);
//Delete member
router.delete('/delete/:id',verifyToken,deleteMember);
//Get member
router.get('/get/:id',verifyToken,getMember);

module.exports = router;
