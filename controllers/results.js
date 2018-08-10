const Test = require('../models').test;
const logger = require('../logger')('results_controller');

// GET list of all runs.
exports.index = (req, res, next) => {
    const testId = req.params.testId
    return Test.findById(testId)
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
    const testId = req.params.testId
    const resultData = req.body

    return Test.findById(testId)
    .then(test => {
        return test.addResult(resultData)
    })
    .then(test => {
        res.status(200).send(test)
    })
    .catch(err => {
        next(err)
    })
}