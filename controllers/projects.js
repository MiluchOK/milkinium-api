const Project = require('../models/projects');
const logger = require('../logger')('projects_controller');

const getProjectById = (cazeId) => {
    return Project
        .findById(cazeId)
        .populate('cases')
        .exec();
};

// GET list of all projects.
exports.index = (req, res, next) => {
    const projects = Project
        .find({})
        .populate('cases')
        .exec();
    projects
        .then((data) => {
            res.status(200).json(data);
        })
};

// GET a specific case
exports.show = (req, res, next) => {
    const project = getProjectById(req.params.projectId);
    project.then((data) => {
        res.status(200).json(data);
    })
};


exports.create = (req, res, next) => {
    const projectData = req.body;
    const project = new Project(projectData);

    project.save()
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((err) => {
        next(err);
    });
};

exports.update = (req, res, next) => {
    res.status(200).json({message: "fooo"});
};

exports.destroy = (req, res, next) => {
    res.status(200).json({message: "fooo"});
};