const logger = require('../helper/logger');
const Action = require('../models/Action');
const Board = require('../models/Board');
const List = require('../models/List');

let loggerInfo = logger('Info');
let loggerError = logger('Error');
//Function helper
const checkAuthorized = async (idAction, idMember, idList = null) => {
    let error = "";
    if (!idList) {
        let actionInfo;
        try {
            actionInfo = await Action.findById(idAction);
            if (actionInfo) {
                idList = actionInfo.idList;
            }
            else {
                loggerError("No Action was found!")
                return [null, null, "No Action was found!"]
            }
        }
        catch (error) {
            loggerError(error)
            return [null, null, error]
        }
    }
    //Check is list member
    let checkAuthorizedList;
    try {
        checkAuthorizedList = await List.findOne({
            $and: [{
                $or: [{
                    idAuthor: idMember,
                }, {
                    listMember: idMember,
                }]
            }, { _id: idList }]
        });
    }
    catch (error) {
        loggerError(error)
        return [null, null, error]
    }

    let listinfo;
    let idBoard
    try {
        listinfo = await List.findById(idList)
        if (listinfo) {
            idBoard = listinfo.idBoard;
        }
        else {
            loggerError("No list was found!")
            return [null, null, "No list was found!"]
        }
    }
    catch (error) {
        loggerError(error)
        return [null, null, error]
    }

    //Check is board author
    let checkAuthorBoard;
    try {
        checkAuthorBoard = await Board.findOne({ $and: [{ idAuthor: idMember }, { _id: idBoard }] });
    }
    catch (error) {
        loggerError(error)
        return [null, null, error]
    }
    return [checkAuthorBoard, checkAuthorizedList, error]
}

//Create
const createAction = async (req, res, next) => {
    loggerInfo('Creating Action...');
    if (req.member) {
        const idList = req.body.idList;
        const idMember = req.member.id;
        const [checkAuthorBoard, checkAuthorizedList, errorInfo] = await checkAuthorized(undefined, idMember, idList)
        if (checkAuthorBoard || checkAuthorizedList) {
            const action = new Action(req.body);
            req.body.idAuthor = idMember;
            try {
                let newAction = await action.save();
                res.status(201).json(newAction);
            } catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(500).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}



//Get Action
const getAction = async (req, res, next) => {
    loggerInfo('Getting Action...');
    if (req.member) {
        const idAction = req.params.id;
        const idMember = req.member.id;
        const [checkAuthorBoard, checkAuthorizedList, errorInfo] = await checkAuthorized(idAction, idMember)
        if (checkAuthorBoard || checkAuthorizedList) {
            try {
                let actionInfo = await Action.findById(idAction);
                res.status(200).json(actionInfo);
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(500).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}

//Get All Actions
const getActions = async (req, res, next) => {
    loggerInfo('Getting Action...');
    if (req.member) {
        const idList = req.query.idList;
        const idMember = req.member.id;
        const [checkAuthorBoard, checkAuthorizedList, errorInfo] = await checkAuthorized(undefined, idMember, idList)
        if (checkAuthorBoard || checkAuthorizedList) {
            try {
                let actions = await Action.find({ idList: idList });
                res.status(201).json(actions);
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(500).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}


//Update

const updateAction = async (req, res, next) => {
    loggerInfo('Updating Action....');
    if (req.member) {
        const idAction = req.params.id;
        const idMember = req.member.id;
        let actionUpdateInfo = req.body
        //Remove idList change
        if (actionUpdateInfo.idList) {
            delete actionUpdateInfo.idList;
        }
        if (actionUpdateInfo.idAuthor) {
            delete actionUpdateInfo.idAuthor;
        }
        const [checkAuthorBoard, checkAuthorizedList, errorInfo] = await checkAuthorized(idAction, idMember)
        if (checkAuthorBoard || checkAuthorizedList) {
            try {
                const actionUpdate = await Action.findByIdAndUpdate(idAction, { $set: actionUpdateInfo }, { new: true });
                res.status(200).json(actionUpdate);
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(500).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}

// Delete

const deleteAction = async (req, res, next) => {
    loggerInfo('Deleting Action....')
    if (req.member) {
        const idAction = req.params.id;
        const idMember = req.member.id;
        const [checkAuthorBoard, checkAuthorizedList, errorInfo] = await checkAuthorized(idAction, idMember)
        if (checkAuthorBoard || checkAuthorizedList) {
            try {
                await Action.findByIdAndDelete(idAction);
                res.status(200).json("Action has been deleted!");
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(500).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}


module.exports = { updateAction, getAction, getActions, deleteAction, createAction };