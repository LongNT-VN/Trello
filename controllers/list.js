const logger = require('../helper/logger');
const List = require('../models/List');
const Board = require('../models/Board');

let loggerInfo = logger('Info');
let loggerError = logger('Error');
//Create
const createList = async (req, res, next) => {
    loggerInfo('Creating List...');
    if (req.member) {
        const checkAuthor = await Board.findOne({ $and: [{ idAuthor: req.member.id }, { _id: req.body.idBoard }] });
        if (checkAuthor) {
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
    const idBoard = req.params.id;
    const idMember = req.member.id;
    if (req.member) {
        const checkAuthorization = await Board.findOne({
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
        let idBoard;
        let listUpdateInfo = req.body
        //Remove idBoard change
        if (listUpdateInfo.idBoard) {
            idBoard = listUpdateInfo.idBoard;
            delete listUpdateInfo.idBoard;
        }
        const checkAuthorization = await Board.findOne({
            $and: [
                {
                    idAuthor: idMember,
                },
                { _id: idBoard }]
        });
        // Check this is the author of board
        if (checkAuthorization) {
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
            let checkMember = await List.findOne({ $and: [{ _id: idList }, { listMember: idMember }] })
            //Check this is a member of List
            if (checkMember) {
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
        let idBoard = req.body.idBoard;
        const checkAuthorization = await Board.findOne({
            $and: [
                {
                    idAuthor: idMember,
                },
                { _id: idBoard }]
        });
        if (checkAuthorization) {
            try {
                await List.findByIdAndDelete(idList);
                res.status(200).json("List has been deleted!");
            } catch (error) {
                loggerError(error)
                res.status(500).json(error)
            }
        }
        else {
            let checkMember = await List.findOne({ $and: [{ _id: idList }, { listMember: idMember }] })
            //Check this is a member of List
            if (checkMember) {
                try {
                    await List.findByIdAndDelete(idList);
                    res.status(200).json("List has been deleted!");
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
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not authorized!')
    }
}


module.exports = { updateList, getLists, deleteList, createList };