const Promise = require('bluebird');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
}, {
        toJSON: { virtuals: true },
        id: false
});

ProjectSchema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'project'
});

ProjectSchema.statics.findWithCases = function(id){
    const self = this;
    return new Promise(function(resolve, reject){
        self.findById(id)
            .populate('cases')
            .exec()
            .then((data) => {
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            })
    })
};


//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;