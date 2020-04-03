const Project = require('../models').project;
const logger = require('../logger')('projects_controller');

// GET list of all projects.
exports.index = (req, res, next) => {
    return Project.find({})
    .populate('cases')
    .then((data) => {
        const responseData = data.map(p => {
            let modified = p.toJSON();
            modified.cases = modified.cases.map(c => c.id);
            return modified
        });
        res.status(200).json({projects: responseData});
    })
    .catch((err) => {
        next(err)
    })
};

// GET a specific project
exports.show = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.sureFindById(projectId)
    .then(data => {
        res.status(200).json(data);
    })
    .catch(err => {
        next(err)
    })
};


exports.create = (req, res, next) => {
    const projectData = req.body;
    const project = new Project(projectData);
    logger('debug', "Creating a project");
    return project.save()
    .then(data => {
        return Project.sureFindById(data._id)
    })
    .then(project => {
        res.status(201).json(project);
    })
    .catch(err => {
        next(err);
    });
};

exports.update = (req, res, next) => {
    const projectId = req.params.projectId;
    const projectUpdate = req.body;
    return Project.sureFindById(projectId)
    .then(project => {
        return project.update(projectUpdate)
    })
    .then(() => {
        res.status(200).json({message: 'success'})
    })
    .catch(err => {
        next(err)
    })
};

exports.destroy = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.sureFindById(projectId)
    .then(project => {
        return project.remove()
    })
    .then(() => {
        res.status(200).json({message: 'Deleted'});
    })
    .catch((err) => {
        next(err)
    })
};
