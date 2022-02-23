const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    title: String,
    idList: { type: String, require: true},
    idAuthor: { type: String, require: true},
    description: String,
    isComplete: { type: Boolean, default: false},
    Date: { type: String},
    actionMember: {type: [String], default: []}
    },{ timestamps: true }
);

module.exports = mongoose.model('Action',actionSchema);