const User = require('../models').user;
const logger = require('../logger')('users_controller');

// GET list of all users.
exports.index = (req, res, next) => {
    logger('info', 'Getting users.');
    const users = User.find({});
    users
        .then((data) => {
            res.status(200).json({'users': data});
        })
        .catch((err) => {
            next(err);
        })
};

// GET a specific user
exports.show = (req, res, next) => {
    const id = req.params.userId;
    logger('info', `Getting a users with id ${id}`);
    const user = User.sureFindById(id);
    user
    .then((data) => {
        res.status(200).json(data)
    })
    .catch((err) => {
        next(err);
    })
};


exports.create = (req, res, next) => {
    let user = new User(req.body);
    user.save()
        .then((data) => {
            res.status(201).json(data)
        })
        .catch((err) => {
            next(err);
        })
};

exports.update = (req, res, next) => {
    const userId = req.params.userId;
    User.sureFindById(userId)
    .then(user => {
        return user.update(req.body)
    })
    .then((updatedUser) => {
        res.status(200).json({message: 'success'})
    })
    .catch((err) => {
        next(err)
    })
};

exports.destroy = (req, res, next) => {
    const id = req.params.userId;
    logger('info', `Removing a users with id ${id}`);
    User.sureFindById(id)
    .then((user) => {
        return user.remove()
    })
    .then(() => {
        res.status(200).json({message: 'Deleted'})
    })
    .catch((err) => {
        next(err);
    })
}