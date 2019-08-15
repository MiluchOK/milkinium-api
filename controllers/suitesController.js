const Suite = require('../models').suite;
const Project = require('../models').project;
const logger = require('../logger')('suites_controller');

exports.index = (req, res, next) => {
    const projectId = req.params.projectId;
    return Project.sureFindById(projectId)
    .then((project) => {
        console.log(project)
        res.status(200).json({suites: project.suites});
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
    const suiteId = req.params.suiteId
    const newData = req.body

    return Suite.sureFindById(suiteId)
    .then(targetSuite => {
        if ("title" in newData) {
            targetSuite.title = newData["title"]
        }
        if ("cases" in newData) {
            targetSuite.cases = newData["cases"]
        }
        return targetSuite.save()
    })
    .then(updatedSuite => {
        logger('debug', "Updated suite: ")
        logger('debug', updatedSuite)
        return res.status(200).json({ message: "Updated" })
    })
    .catch(err => {
        next(err)
    })

    

    // return Suite.updateOne({ _id: suiteId }, newData)
    // .then(status => {
    //     logger('debug', "Number of documents matched: " + status.n)
    //     return Suite.sureFindById(suiteId)
    // })
    // .then(suite => {
    //     logger('debug', "Suite found after new search.")
    //     logger('debug', suite)
    //     res.status(200).json({ message: "Updated" })
    // })
    // .catch(err => {
    //     next(err)
    // })
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