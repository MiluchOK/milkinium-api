const Project = require('../models/projects');
const logger = require('../logger')('projects_controller');

// GET list of all projects.
exports.index = (req, res, next) => {
    return Project.find({})
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        next(err)
    })
};

// GET a specific project
exports.show = (req, res, next) => {
    const projectId = req.params.projectId
    return Project.findById(projectId)
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        next(err)
    })
};


exports.create = (req, res, next) => {
    const projectData = req.body;
    const project = new Project(projectData);

    return project.save()
    .then((data) => {
        logger('debug', 'Saved a project')
        res.status(201).json(data);
    })
    .catch((err) => {
        logger('debug', 'Failed to save a project')
        next(err);
    });
};

exports.update = (req, res, next) => {
    const projectId = req.params.projectId
    return Project.findByIdAndUpdate(projectId)
    .then(() => {
        res.status(200).json({success: true})
    })
    .catch((err) => {
        next(err)
    })
};

exports.destroy = (req, res, next) => {
    const projectId = req.params.projectId
    return Project.findOneAndRemove(projectId)
    .then(() => {
        res.status(200).json({success: true});
    })
    .catch((err) => {
        next(err)
    })
};