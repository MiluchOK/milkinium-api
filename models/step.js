const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const toJson = require('./toJson')

const StepSchema = new Schema({
    body: {
        type: String,
        required: true,
        minlength: [1, 'Cannot be empty'],
    }
}, {
        toJSON: toJson
});



//Exporting our model
const StepModel = mongoose.model('Step', StepSchema);
module.exports = StepModel;