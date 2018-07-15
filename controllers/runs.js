const Run = require('../models/runs');
const logger = require('../logger')('runs_controller');

// GET list of all runs.
exports.index = (req, res, next) => {
    const pid = req.params.projectId
    return Run.find({project: pid})
    .then((data) => {
        res.status(200).json({runs: data});
    })
    .catch((err) => {
        next(err)
    })
};

// GET a specific run
exports.show = (req, res, next) => {
    const runId = req.params.runId
    return Run.findById(runId)
    .then((data) => {
        res.status(200).json(data);
    })
    .catch((err) => {
        next(err)
    })
};


// CREATE a run
exports.create = (req, res, next) => {
    const pid = req.params.projectId
    const runData = Object.assign(req.body, {project: pid});
    const run = new Run(runData);

    return run.save()
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((err) => {
        next(err);
    });
};