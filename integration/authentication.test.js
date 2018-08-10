const request = require('supertest');
const User = require('../models/users');
const app = require('../app');

describe('Authentication', function(){
    describe('post', function(){
        describe('valid credentials', function(){
            test('should return an auth token', function(){
                const password = 'fooo'
                return User.createRandom({password: password})
                .then((newUser) => {
                    return request(app)
                    .post('/v1/authenticate')
                    .send({
                        email: newUser.email,
                        password: password
                    })
                    .expect(200)
                })
                .then((response) => {
                    expect(response.body).toHaveProperty("token")
                })
            })
        })

        describe('invalid credentials', function(){
            test('should throw an error', function(){
                const password = 'fooo'
                return User.createRandom({password: password})
                .then((newUser) => {
                    return request(app)
                    .post('/v1/authenticate')
                    .send({
                        email: newUser.email,
                        password: 'randomStuff'
                    })
                    .expect(401)
                })
                .then((response) => {
                    expect(response.body).toEqual({error: "Unauthorized"})
                })
            })
        })
    })

    describe('get', function(){
        describe('valid credentials', function(){
            test('should reset token', function(){
                const password = 'fooo'
                return User.createRandom({password: password})
                .then(newUser => {
                    return request(app)
                    .post('/v1/authenticate')
                    .send({
                        email: newUser.email,
                        password: password
                    })
                })
                .then(response => {
                    const token = response.body.token
                    return request(app)
                    .get('/v1/authenticate')
                    .set('Authorization', token)
                    .expect(200)
                })
                .then((response) => {
                    expect(response.body).toHaveProperty('token')
                })
            })
        })

        describe('invalid credentials', function(){
            test('should throw an error', function(){
                return request(app)
                .get('/v1/authenticate')
                .expect(401)
                .then((response) => {
                    expect(response.body).toEqual({error: "No authorization token was found"})
                })
            })
        })
    })
})