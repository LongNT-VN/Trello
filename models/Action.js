const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    title: { type: String, require: true},
    idList: { type: String, require: true},
    idAuthor: { type: String, require: true},
    description: { type: String, require: true},
    isComplete: { type: Boolean, default: false},
    Date: { type: String},
    actionMember: {type: [String], default: []}
    },{ timestamps: true }
);

module.exports = mongoose.model('Action',actionSchema);