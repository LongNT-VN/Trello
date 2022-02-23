const logger = require('../helper/logger');
const Member = require('../models/Member');
const bcrypt = require('bcrypt');

let loggerInfo = logger('Info');
let loggerError = logger('Error');

//Update

const updateMember = async (req, res, next) => {
    loggerInfo('Updating member....')
    if (req.params.id === req.member.id) {
        if (req.body.oldPassword) {
            const member = await Member.findById(req.params.id);
            let isMember = await bcrypt.compare(req.body.oldPassword, member.password);
            if (isMember) {
                let hashPassword = await bcrypt.hash(req.body.Password, 12)
                try {
                    const updateMember = await Member.findByIdAndUpdate(req.params.id, {
                        $set: { "password": hashPassword }
                    }, { new: true })
                    res.status(200).json(updateMember);
                } catch (error) {
                    loggerError(error);
                    res.status(500).json(err);
                }
            }
            else
            {
                res.status(403).json("Wrong password");
            }
        }
        else {
            try {
                let memberUpdateInfo = req.body
                if (memberUpdateInfo.email) {
                    delete memberUpdateInfo.email;
                }
                const updateMember = await Member.findByIdAndUpdate(req.params.id, {
                    $set: memberUpdateInfo
                }, { new: true })
                res.status(200).json(updateMember);
            } catch (error) {
                loggerError(error);
                res.status(500).json(err);
            }
        }
    }
    else {
        loggerError("Not accessed!");
        res.status(403).json("You only update your account");
    }

}
// Delete

const deleteMember = async (req, res, next) => {
    loggerInfo('Deleting member....')
    if (req.params.id === req.member.id) {
        try {
            await Member.findByIdAndDelete(req.params.id);
            res.status(200).json("Member has been deleted");
        } catch (error) {
            loggerError(error);
            res.status(500).json(err);
        }
    }
    else {
        loggerError("Not accessed!");
        res.status(403).json("You only detele your account");
    }
}

//Read
const getMember = async (req, res, next) => {
    loggerInfo('Getting member...');
    if (req.params.id === req.member.id) {
        try {
            let member = await Member.findById(req.params.id);
            let { password, ...info } = member._doc;
            res.status(200).json(info);
        } catch (error) {
            loggerError(error);
            res.status(500).json(err);
        }
    }
    else {
        loggerError("Not accessed!");
        res.status(403).json("You not authorized");
    }

}

module.exports = { updateMember, getMember, deleteMember };