const logger = require('../helper/logger');
const Board = require('../models/Board');
const List = require('../models/List');
const Action = require('../models/Action');

let loggerInfo = logger('Info');
let loggerError = logger('Error');
//Create
const createBoard = async (req, res, next) => {
    loggerInfo('Creating Board...');
    if (req.member) {
        const board = new Board(req.body);
        board.idAuthor = req.member.id;
        try {
            let newBoard = await board.save();
            res.status(201).json(newBoard);
        } catch (error) {
            loggerError(error)
            res.status(500).json(error)
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not member!')
    }
}


//Get
const getBoard = async (req, res, next) => {
    loggerInfo('Getting Board...');
    const idQuery = req.params.id;
    const idMember = req.member.id;
    if (idQuery && idMember) {
        try {
            let boards = await Board.findOne({
                $and: [
                    {
                        $or: [{
                            idAuthor: idMember,
                        }, {
                            boardMember: idMember,
                        }]
                    },
                    { _id: idQuery }]
            });
            res.status(200).json(boards);
        } catch (error) {
            loggerError(error)
            res.status(500).json(error)
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('No board found!')
    }
}

//Get all Board
const getBoards = async (req, res, next) => {
    loggerInfo('Getting Board...');
    if (req.member) {
        const idMember = req.member.id;
        try {
            let boards = await Board.find({
                $or: [{
                    idAuthor: idMember,
                }, {
                    boardMember: idMember,
                }]

            });
            res.status(200).json(boards);
        } catch (error) {
            loggerError(error)
            res.status(500).json(error)
        }
    }
    else {
        loggerError("Not access!")
        res.status(403).json('You are not a member!')
    }
}


//Update
const updateBoard = async (req, res, next) => {
    loggerInfo('Updating Board....');
    if (req.member) {
        let boardUpdateInfo = req.body
        if (boardUpdateInfo.idAuthor) {
            delete boardUpdateInfo.idAuthor;
        }
        const checkAuthor = await Board.findOne({ $and: [{ idAuthor: req.member.id }, { _id: req.params.id }] });
        if (checkAuthor) {
            try {
                const BoardUpdate = await Board.findOneAndUpdate({ $and: [{ idAuthor: req.member.id }, { _id: req.params.id }] },
                    { $set: boardUpdateInfo }, { new: true });
                res.status(200).json(BoardUpdate);
            }
            catch (error) {
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
        res.status(403).json('You are not authorized!')
    }
}

// Delete

const deleteBoard = async (req, res, next) => {
    loggerInfo('Deleting Board....')
    if (req.member) {
        try {
            const checkAuthor = await Board.findOne({ $and: [{ idAuthor: req.member.id }, { _id: req.params.id }] });
            if (checkAuthor) {
                try {
                    await Board.findOneAndDelete({ $and: [{ idAuthor: req.member.id }, { _id: req.params.id }] });
                    let lists = await List.find({idBoard: req.params.id})
                    await List.deleteMany({idBoard: req.params.id})
                    for(let i in lists)
                    {
                        await Action.deleteMany({idList: lists[i]._id})
                    }
                }
                catch (error) {
                    loggerError(error)
                    res.status(500).json(error)
                }
                res.status(200).json("Board has been deleted!");
            }
            else {
                loggerError("Not access!")
                res.status(403).json('You are not a author!')
            }
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


module.exports = { updateBoard, getBoard, deleteBoard, createBoard, getBoards };