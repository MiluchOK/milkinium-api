const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StatusSchema = new Schema({
    label: String
}, { _id : false });

module.exports = StatusSchema;