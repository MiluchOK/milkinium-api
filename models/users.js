//Users model
const Promise = require('bluebird');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const nameSchema = require('./names');
const logger = require('../logger')('users_model');
const SALT_WORK_FACTOR = 10;


const UserSchema = Schema({
    name: {
        type: nameSchema,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        // unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ['Admin', 'Client'],
        default: 'Client'
    }
});

UserSchema.pre('save', (next) => {
    let user = this;
    logger('info', `Salting password for ${user}`);

    return next();
});


UserSchema.pre('save', function (next) {
    let user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    const selfPassword = this.password;
    logger('debug', `Comparing password: ${candidatePassword} and hash ${this.password}`);
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, selfPassword)
            .then((res) => {
                logger('debug', 'Resolving password compare with ' + res);
                resolve(res);
            })
            .catch((err) => {
                logger('debug', `Error comparing passwords. ${err}`);
                reject(err);
            })
    });
};

//Exporting our model
const UserModel = mongoose.model('Users', UserSchema);
module.exports = UserModel;