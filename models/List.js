const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: { type: String, require: true},
    idBoard: { type: String, require: true},
    idAuthor: { type: String, require: true},
    listMember: {type: [String], default: []}
    },{ timestamps: true }
);

module.exports = mongoose.model('List',listSchema);