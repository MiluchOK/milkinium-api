//Users model
const Promise = require('bluebird');
const mongoose = require('mongoose');
const validator = require('validator');
const faker = require('faker');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const nameSchema = require('./names');
const logger = require('../logger')('users_model');
const passwordSalting = require('./support/salt')
const errorMessages = require('../errors').users


const UserSchema = Schema({
    name: {
        type: nameSchema,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        validate: [ validator.isEmail, errorMessages.invalidEmail ],
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        validate: [validator.isURL, errorMessages.invalidAvatar]
    },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
}, { 
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret, options){ 
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
    id: true
 });

UserSchema.pre('save', passwordSalting);

UserSchema.methods.comparePassword = function (candidatePassword) {
    const selfPassword = this.password;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, selfPassword)
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

UserSchema.statics.createRandom = function(args){
    let randomUserData = {
        name: {
            first: faker.name.firstName(),
            last: faker.name.lastName()
        },
        email: faker.internet.email(),
        password: faker.internet.password()
    }
    randomUserData = Object.assign(randomUserData, args)
    return UserModel(randomUserData).save()
}

//Exporting our model
const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;