const Promise = require('bluebird');
const Case = require('../models/cases');
const Project = require('../models/projects');
const logger = require('../logger')('cases_controller');


// GET list of all cases.
exports.index = (req, res, next) => {
    logger('debug', 'Getting cases.');
    const projectId = req.params.projectId;
    return Project.findById(projectId)
        .then((data) => {
            logger('debug', data)
            res.status(200).json({cases: data.cases});
        })
        .catch((err) => {
            next(err);
        })
};

// GET a specific case
exports.show = (req, res, next) => {
    logger('info', 'Getting a case.');
    const id = req.params.caseId;
    return Case.findById(id)
        .then((caze) => {
            res.status(200).json(caze);
        })
        .catch((err) => {
            next(err);
        });
};


exports.create = (req, res, next) => {
    logger('info', 'Creating a case.');
    const projectId = req.params.projectId;
    const data = req.body;
    data.project = projectId;
    logger('info', data)
    let caze = new Case(data);
    return caze.save()
        .then((data) => {
            logger("info", `Case is created ${data}`);
            res.status(201).json(data)
        })
        .catch((err) => {
            logger("error", "Could not create a case: " + err);
            next(err);
        })
};

exports.update = (req, res, next) => {
    logger('info', 'Updating a case.');
    const id = req.params.caseId;
    const newCazeData = req.body;
    return Case.findOneAndUpdate({'_id': id}, newCazeData)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });
};

exports.destroy = (req, res, next) => {
    logger('info', 'Deleting a case.');
    const id = req.params.caseId;
    return Case.findOneAndRemove({'_id': id})
        .then((data) => {
            logger('info', `Deleted case successfully. Object: ${data}`);
            res.status(200).json({success: true})
        })
        .catch((err) => {
            next(err)
        })
};