const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
    title: { type: String, require: true, unique: true },
    description: { type: String, require: true},
    idList: { type: String, require: true}
    },{ timestamps: true }
);

module.exports = mongoose.model('Action',actionSchema);