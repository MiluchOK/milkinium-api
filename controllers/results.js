const Result = require('../models/results');
const Test = require('../models/tests');
const logger = require('../logger')('results_controller');

// GET list of all runs.
exports.index = (req, res, next) => {
    const testId = req.params.testId
    Test.findById(testId)
    .then(test => {
        return test.getResults()
    })
    .then(results => {
        res.status(200).send({results: results})
    })
    .catch(err => {
        next(err)
    })
};


exports.create = (req, res, next) => {
    res.status(200).send({message: 'No implemmented'})
}