const mongoose = require('mongoose');
const faker = require('faker');
const Run = require('./runs');
const Case = require('./cases');
const Schema = mongoose.Schema;

let ProjectSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    }
}, {
        versionKey: false,
        toJSON: { 
            virtuals: true,
            transform: function(doc, ret, options){ 
                delete ret._id;
                if(ret.hasOwnProperty('cases') && ret.cases == null){
                    ret.cases = []
                }
                return ret;
            },
        },
        id: true
});

ProjectSchema.virtual('cases', {
    ref: 'Case',
    localField: '_id',
    foreignField: 'project',
    justOne: false
});

ProjectSchema.statics.createRandom = function(){
    randomData = {
        name: faker.internet.userName()
    }
    return ProjectModel(randomData).save()
}

ProjectSchema.methods.createRun = function(runData){
    return Run.create(Object.assign(runData, {project: this._id}))
}

ProjectSchema.methods.createCase = function(caseData){
    return Case.create(Object.assign(caseData, {project: this._id}))
}

ProjectSchema.methods.getCases = function(){
    return this.populate('cases').execPopulate()
    .then((project) => {
        return project.cases || []
    })
}

ProjectSchema.pre('findOne', function() {
    this.populate('cases')
});

ProjectSchema.post('save', function(doc, next) {
    doc.populate('user').execPopulate().then(function() {
      next();
    });
  });

//Exporting our model
const ProjectModel = mongoose.model('Project', ProjectSchema);
module.exports = ProjectModel;