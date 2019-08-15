const Case = require('../models').case;
const Project = require('../models').project;
const StepTemplate = require('../models').stepTemplate;
const Suite = require('../models').suite;
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
    let responseData = {}
    return Case.sureFindById(id)
    .then((unpopuilatedCaze) => {
        return unpopuilatedCaze
        .populate('steps')
        .execPopulate()
    })
    .then(caze => {
        responseData = caze.toJSON()
        return Suite.find({ cases: { $all: [ caze.id ] } }).distinct('_id')
    })
    .then(foundCases => {
        responseData.suites = foundCases
        logger('debug', "Suits found: ")
        logger('debug', responseData.suites)
        res.status(200).json(responseData);
    })
    .catch((err) => {
        next(err);
    });
};


exports.create = (req, res, next) => {
    const projectId = req.params.projectId;
    const data = req.body;
    data.project = projectId;
    let targetProject;
    let responseData;

    return Project.sureFindById(projectId)
    .then(project => {
        targetProject = project
        let allSteps = []
        data.steps.map(s => {
            allSteps.push(StepTemplate.create(s))
        })
        return Promise.all(allSteps)
    })
    .then(steps => {
        data.steps = steps.map(s => s._id)
        return targetProject.createCase(data)
    })
    .then(caze => {
        responseData = caze.toJSON()
        return Suite.find({ cases: { $all: [ caze.id ] } }).distinct('_id')
    })
    .then(suites => {
        responseData.suites = suites
        res.status(201).json(responseData)
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