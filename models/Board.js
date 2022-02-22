const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    title: String,
    idAuthor: { type: String, require: true},
    boardMember: {type: [String], default: []}
    },{ timestamps: true }
);

module.exports = mongoose.model('Board',boardSchema);