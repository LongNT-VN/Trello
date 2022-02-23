const logger = require('../helper/logger');
const List = require('../models/List');
const Board = require('../models/Board');
const Action = require('../models/Action');

let loggerInfo = logger('Info');
let loggerError = logger('Error');
//Function Helper
const checkAuthorized = async (idList, idMember) => {
    let listinfo;
    let idBoard;
    let errorInfo = "";
    try {
        listinfo = await List.findById(idList);
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
    let checkAuthorization;
    try {
        checkAuthorization = await Board.findOne({
            $and: [
                {
                    idAuthor: idMember,
                },
                { _id: idBoard }]
        });
    }
    catch (error) {
        loggerError(error)
        return [null, null, error]
    }
    let checkMember;
    try {
        checkMember = await List.findOne({
            $and: [{
                $or: [{
                    idAuthor: idMember,
                }, {
                    listMember: idMember,
                }]
            }, { _id: idList }]
        })
    }
    catch (error) {
        loggerError(error)
        return [null, null, error]
    }
    return [checkAuthorization, checkMember, errorInfo]
}

//Create
const createList = async (req, res, next) => {
    loggerInfo('Creating List...');
    if (req.member) {
        const idMember = req.member.id;
        let checkAuthor;
        try {
            checkAuthor = await Board.findOne({
                $and: [{
                    $or: [{
                        idAuthor: idMember,
                    }, {
                        boardMember: idMember,
                    }]
                }, { _id: req.body.idBoard }]
            });
        } catch (error) {
            loggerError(error)
            res.status(500).json(error)
        }
        if (checkAuthor) {
            req.body.idAuthor = idMember;
            const list = new List(req.body);
            try {
                let newList = await list.save();
                res.status(201).json(newList);
            } catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            loggerError("Not access!")
            res.status(403).json('You are not a author!')
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}



//Get all
const getLists = async (req, res, next) => {
    loggerInfo('Getting List...');
    if (req.member) {
        const idBoard = req.query.idBoard;
        const idMember = req.member.id;
        let checkAuthorization;
        try {
            checkAuthorization = await Board.findOne({
                $and: [
                    {
                        $or: [{
                            idAuthor: idMember,
                        }, {
                            boardMember: idMember,
                        }]
                    },
                    { _id: idBoard }]
            });
        }
        catch (error) {
            loggerError(error)
            res.status(500).json(error)
        }
        if (checkAuthorization) {
            try {
                let lists = await List.find({ idBoard: idBoard });
                res.status(201).json(lists);
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            loggerError("Not access!")
            res.status(403).json('You are not authorized!')
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}

//Update

const updateList = async (req, res, next) => {
    loggerInfo('Updating List....');
    if (req.member) {
        const idList = req.params.id;
        const idMember = req.member.id;
        let listUpdateInfo = req.body
        //Remove idBoard change
        if (listUpdateInfo.idBoard) {
            delete listUpdateInfo.idBoard;
        }
        const [checkAuthorization, checkMember, errorInfo] = await checkAuthorized(idList, idMember)
        if (checkAuthorization || checkMember) {
            try {
                const ListUpdate = await List.findByIdAndUpdate(idList, { $set: listUpdateInfo }, { new: true });
                res.status(200).json(ListUpdate);
            }
            catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(403).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not authorized!')
    }
}

// Delete

const deleteList = async (req, res, next) => {
    loggerInfo('Deleting List....')
    if (req.member) {
        const idList = req.params.id;
        const idMember = req.member.id;
        const [checkAuthorization, checkMember, errorInfo] = await checkAuthorized(idList, idMember)
        if (checkAuthorization || checkMember) {
            try {
                await List.findByIdAndDelete(idList);
                await Action.deleteMany({idList: idList})
                res.status(200).json("List has been deleted!");
            } catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            if (errorInfo != "") {
                loggerError(errorInfo)
                res.status(403).json(errorInfo)
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not authorized!')
            }
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not authorized!')
    }
}


module.exports = { updateList, getLists, deleteList, createList };