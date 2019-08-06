const mongoose = require('mongoose')
const sureFirePlugin = require('./plugins/sureFind')
mongoose.plugin(sureFirePlugin)

const caze = require('./cases')
const project = require('./projects')
const run = require('./runs')
const test = require('./tests')
const user = require('./users')
const stepTemplate = require('./stepTemplateModel')
const step = require('./stepModel')
const suite = require('./suitesModel')

module.exports = {
    case: caze,
    project: project,
    run: run,
    test: test,
    user: user,
    stepTemplate: stepTemplate,
    step: step,
    suite: suite
}


