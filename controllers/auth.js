/**
 * Created by amilyukov on 3/7/18.
 */
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const logger = require('../logger')('auth_controller');
const User = require('../models/users');

createToken = (data) => {
    const secret = process.env.JWT_SECRET;
    return ('Bearer ' + jwt.sign({
        data: data
    }, secret, {expiresIn: '1h'}));
};

exports.issueToken = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = User.findOne({email: email}).exec();

    user
        .then((user) => {
            if (user === null) {
                logger('warn', 'User could not be found.');
                return res.status(404).json({error: `User with email ${email} could not be found.`});
            }

            user.comparePassword(password)
                .then((accepted) => {
                    if (accepted === true) {
                        logger('info', 'Issuing a new token for user ' + user);
                        const filteredUserData = _.pick(user, ['email', 'name', '_id', 'role', 'avatar']);
                        let token = createToken(filteredUserData);
                        logger('info', `A new token has been issued.`);
                        res.status(200).json({token: token});
                    }
                    else {
                        res.status(401).json({error: 'Unauthorized'});
                    }
                });
        })
        .catch((err) => {
            next(err);
        });
};

exports.refreshToken = (req, res) => {
    logger('info', 'Refreshing a token');
    const data = req.user;
    let token = createToken(data);
    res.status(200).json({token: token});
};

exports.whoAmI = (req, res) => {
    res.status(200).json(req.user.data);
};