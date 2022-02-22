const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Member = require('../models/Member');

const logger = require('../helper/logger');
const loggerInfo = logger('Info');
const loggerError = logger('Error');


//Register

const register = async (req, res, next) => {
    try {
        const {
            email,
            name,
            age,
            numberPhone,
            password,
            avatar,
        } = req.body;
        const existedMember = await Member.findOne({ email: email });
        if (existedMember)
            res.status(401).send("Email was used !");
        else {
            let newMember = new Member({
                email: email,
                name: name,
                age: age,
                numberPhone: numberPhone,
                password: await bcrypt.hash(password, 12),
                avatar: avatar,
            });
            loggerInfo('Save to databse....');
            let member = await newMember.save();
            loggerInfo(member);
            res.status(201).json(member);
        }
    }
    catch (err) {
        loggerError(err);
        res.status(500).json(err);
    }
}

//Login

const login = async (req, res, next) => {
    try {
        const {
            email,
            password,
        } = req.body;
        loggerInfo('Find your email from databse....');
        const existedMember = await Member.findOne({ email: email });
        if (!existedMember)
            res.status(401).send('Not found your member')
        else {
            loggerInfo('Find your password from databse....');
            let isMember = await bcrypt.compare(password, existedMember.password);

            if (!isMember)
                res.status(401).send('Wrong Password')
            else {
                let { password, ...info } = existedMember._doc;
                const accessToken = jwt.sign({id: existedMember._id, isAdmin: existedMember.isAdmin},process.env.secretKey,{expiresIn: "3d"})
                loggerInfo(info.email)
                res.status(200).json({...info,accessToken: accessToken});
            }
        }
    }
    catch (err) {
        loggerError(err);
        res.status(500).json(err);
    }
}

module.exports = { register, login }