const mongoose = require('mongoose');
const faker = require('faker');
const Run = require('./runs');
const Case = require('./cases');
const Suite = require('./suitesModel');
const Schema = mongoose.Schema;

let options = {
    toJSON: {
        virtuals: true,
        // minimize: false,
        versionKey: false,
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
};

let ProjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
}, options);

ProjectSchema.virtual('cases', {
    ref: 'Case',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

ProjectSchema.virtual('suites', {
    ref: 'Suite',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

ProjectSchema.statics.createRandom = function(){
    randomData = {
        name: faker.internet.userName()
    };
    return ProjectModel(randomData).save()
};

ProjectSchema.methods.createRun = function(runData){
    return Run.create(Object.assign(runData, {project: this._id}))
};

ProjectSchema.methods.createCase = function(caseData){
    return Case.create(Object.assign(caseData, {project: this._id}))
};

ProjectSchema.methods.addSuite = function(suiteData){
    const data = Object.assign(suiteData, {project: this._id})
    return Suite.create(data)
};

ProjectSchema.methods.getCases = function(){
    return this.populate('cases').execPopulate()
    .then((project) => {
        return project.cases
    })
};

ProjectSchema.pre('findOne', function() {
    this.populate('cases');
    this.populate('suites')
});

// ProjectSchema.post('save', function(doc, next) {
//     doc.populate('user').execPopulate().then(function() {
//       next();
//     });
//   });

//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;