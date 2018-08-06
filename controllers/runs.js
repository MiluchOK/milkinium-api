const Run = require('../models').run;
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

// List tests
exports.listTests = (req, res, next) => {
    const runId = req.params.runId
    return Run.findById(runId)
    .then(run => {
        return run.getTests()
    })
    .then(testsData => {
        res.status(200).json({tests: testsData})
    })
    .catch(err => {
        next(err)
    })
}

// Add cases to run
exports.addCase = (req, res, next) => {
    const runId = req.params.runId
    const casesList = req.body.cases
    logger('info', casesList)
    let run
    return Run.findById(runId)
    .then(r => {
        run = r
        let addPromises = []
        casesList.forEach(c => { 
            addPromises.push(r.addCase(c))
        })
        return Promise.all(addPromises)
    })
    .then(() => {
        return Run.findById(runId)
    })
    .then((r) => {
        run = r
        return run.getTests()
    })
    .then((tests) => {
        res.status(200).json({tests: tests})
    })
    .catch(err => {
        next(err)
    })
}