const Case = require('../models').case;
const Project = require('../models').project;
const logger = require('../logger')('cases_controller');


// GET list of all cases.
exports.index = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.findById(projectId)
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
    return Case.findById(id)
        .then((caze) => {
            res.status(200).json(caze);
        })
        .catch((err) => {
            next(err);
        });
};


exports.create = (req, res, next) => {
    const projectId = req.params.projectId;
    const data = req.body;
    data.project = projectId;
    let caze = new Case(data);
    return caze.save()
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => {
            next(err);
        })
};

exports.update = (req, res, next) => {
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
    const id = req.params.caseId;
    return Case.findOneAndRemove({'_id': id})
        .then((data) => {
            res.status(200).json({success: true})
        })
        .catch((err) => {
            next(err)
        })
};