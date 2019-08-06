const Case = require('../models').case;
const Project = require('../models').project;
const StepTemplate = require('../models').stepTemplate;
const logger = require('../logger')('cases_controller');
const Promise = require('bluebird');


// GET list of all cases.
exports.index = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.sureFindById(projectId)
    .then((data) => {
        res.status(200).json({cases: data.cases});
    })
    .catch((err) => {
        next(err);
    })
};

// GET a specific case
exports.show = (req, res, next) => {
    const id = req.params.caseId;
    return Case.sureFindById(id)
    .then((unpopuilatedCaze) => {
        return unpopuilatedCaze
        .populate('steps')
        .execPopulate()
    })
    .then((caze) => {
        res.status(200).json(caze);
    })
    .catch((err) => {
        next(err);
    });
};


exports.create = (req, res, next) => {
    console.log("Creating a project.")
    const projectId = req.params.projectId;
    const data = req.body;
    data.project = projectId;
    let targetProject;

    return Project.sureFindById(projectId)
    .then(project => {
        console.log("SureFound by id.")
        targetProject = project
        let allSteps = []
        console.log("Looping over the steps.")
        data.steps.map(s => {
            allSteps.push(StepTemplate.create(s))
        })
        console.log("All steps: " + allSteps)
        return Promise.all(allSteps)
    })
    .then(steps => {
        console.log("Looking up steps to create.")
        data.steps = steps.map(s => s._id)
        return targetProject.createCase(data)
    })
    .then(caze => {
        console.log("Returning status code and data.")
        res.status(201).json(caze)
    })
    .catch(err => {
        next(err)
    })
};

exports.update = (req, res, next) => {
    const id = req.params.caseId;
    const newCazeData = req.body;

    let allSteps = []
    newCazeData.steps.map(s => {
        allSteps.push(StepTemplate.create(s))
    })
    return Promise.all(allSteps)
    .then(steps => {
        newCazeData.steps = steps.map(s => s.id)
        return Case.sureFindById(id)
    })
    .then(caze => {
        return caze.update(newCazeData)
    })
    .then(data => {
        return res.status(200).json({message: 'success'});
    })
    .catch(err => {
        next(err);
    });
};

exports.destroy = (req, res, next) => {
    const id = req.params.caseId;
    return Case.sureFindById(id)
    .then(caze => {
        return caze.remove()
    })
    .then((data) => {
        res.status(200).json({message: "Deleted"})
    })
    .catch((err) => {
        next(err)
    })
};