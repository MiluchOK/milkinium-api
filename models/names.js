var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const nameSchema = new Schema({
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    }
},{ _id : false });

module.exports = nameSchema;