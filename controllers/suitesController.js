const Suite = require('../models').suite;
const Project = require('../models').project;
const logger = require('../logger')('suites_controller');

exports.index = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.sureFindById(projectId)
    .then((data) => {
        console.log(data)
        res.status(200).json({suites: data.suites});
    })
    .catch((err) => {
        next(err);
    })
};

exports.show = (req, res, next) => {
    const suiteId = req.params.suiteId
    return Suite.sureFindById(suiteId)
    .then(suite => {
        res.status(200).json(suite)
    })
    .catch(err => {
        next(err)
    })
};


exports.create = (req, res, next) => {
    const projectId = req.params.projectId;
    const suiteData = req.body

    return Project.sureFindById(projectId)
    .then(project => {
        return project.addSuite(suiteData)
    })
    .then(suite => {
        res.status(201).json(suite)
    })
    .catch(err => {
        next(err)
    })
};

exports.update = (req, res, next) => {

};

exports.destroy = (req, res, next) => {
    const suiteId = req.params.suiteId
    return Suite.sureFindById(suiteId)
    .then(suite => {
        return suite.remove()
    })
    .then(data => {
        res.status(200).json({message: "Deleted"})
    })
    .catch(err => {
        next(err)
    })
};