const mongoose = require('mongoose')
const sureFirePlugin = require('./plugins/sureFind')
mongoose.plugin(sureFirePlugin)

const caze = require('./cases')
const project = require('./projects')
const run = require('./runs')
const test = require('./tests')
const user = require('./users')
const step = require('./stepModel')

module.exports = {
    case: caze,
    project: project,
    run: run,
    test: test,
    user: user,
    step: step
}


