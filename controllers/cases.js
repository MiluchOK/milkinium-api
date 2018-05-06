const Promise = require('bluebird');
const Case = require('../models/cases');
const Project = require('../models/projects');
const logger = require('../logger')('cases_controller');

const getCazeById = (cazeId) => {
    return Case.findById(cazeId);
};

const getCasesForAProject = (projectId) => {
    return new Promise(function(resolve, reject){
        logger('debug', `Fetching the project data`);
        Project.findWithCases(projectId)
            .then((data) => {
                logger('debug', `Got project data.`);
                resolve(data.cases);
            })
            .catch((err) => {
                logger('error', `Could not fetch project data.`);
                reject(err);
            })
    })
};

// GET list of all cases.
exports.index = (req, res, next) => {
    logger('info', 'Getting cases.');
    const projectId = req.params.projectId;
    logger('debug', 'Got project id: ' + projectId);
    const cases = getCasesForAProject(projectId);

    cases
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        })
};

// GET a specific case
exports.show = (req, res, next) => {
    logger('info', 'Getting a case.');
    const id = req.params.caseId;
    getCazeById(id)
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
    let caze = new Case(data);
    caze.save()
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
    getCazeById(id)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        });
    res.status(404).json({message: "Not implemented"});
};

exports.destroy = (req, res, next) => {
    logger('info', 'Deleting a case.');
    const id = req.params.caseId;
    Case.findByIdAndRemove(id)
        .then((data) => {
            logger('info', `Deleted case successfully. Object: ${data}`);
            res.status(200).json({message: 'ok'})
        })
        .catch((err) => {
            next(err)
        })
};