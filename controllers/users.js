const User = require('../models/users');
const logger = require('../logger')('users_controller');

// GET list of all users.
exports.index = (req, res, next) => {
    logger('info', 'Getting users.');
    const users = User.find({});
    users
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            next(err);
        })
};

// GET a specific user
exports.show = (req, res, next) => {
    const id = req.params.userId;
    logger('info', `Getting a users with id ${id}`);
    const user = User.findById(id);
    user
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((err) => {
            next(err);
        })
};


exports.create = (req, res, next) => {
    logger('info', `Creating a user with ${req.body}`);
    let user = new User(req.body);
    user.save()
        .then((data) => {
            logger("info", `User is created ${data}`);
            res.status(201).json(data)
        })
        .catch((err) => {
            next(err);
        })
};

exports.update = (req, res, next) => {
    const userId = req.params.userId;
    logger('info', `Updating a user with id ${userId}.`);
    User.findById(userId)
        .then((user) => {
            user.update(req.body)
                .then((r) => {
                    res.status(200).json({message: 'Updated'})
                })
        })
        .catch((err) => {
            logger('error', err);
            res.status(400).json({message: 'Could not update.', err: err})
        })
};

exports.destroy = (req, res, next) => {
    const id = req.params.userId;
    logger('info', `Removing a users with id ${id}`);
    User.findById(id).remove().exec()
        .then(() => {
            logger('warn', `Deleted user by id ${id}`);
            res.status(200).json({message: 'Deleted'})
        })
        .catch((err) => {
            next(err);
        })
}