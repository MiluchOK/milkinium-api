const request = require('supertest');

const dbConnect = require('../config/db_connect');
const User = require('../models/users');
jest.mock('../middleware/authenticate');
const app = require('../app');

let authMock;

beforeEach(() => {
    authMock = require('../middleware/authenticate')
})

describe('User', function(){
    describe('index', function(){
        test('should be auth protected', function(){
            return request(app)
            .get('/v1/users')
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return all users', function(){
            const usersList = [User.createRandom(), User.createRandom()]
            let createdUsers
            return Promise.all(usersList)
            .then((users) => {
                createdUsers = users
                return request(app)
                .get('/v1/users')
                .expect(200)
            })
            .then(response => {
                expect(response.body).toHaveProperty('users')
                const returned_users = response.body.users
                expect(returned_users.length).toBeGreaterThanOrEqual(usersList.length)
                createdUsers.forEach(element => {
                    expect(returned_users).toContainObject(element.toJSON()) 
                });
            })
        })
    })

    describe('show', function(){
        test('should be auth protected', function(){
            return request(app)
            .get('/v1/users/507f1f77bcf86cd799439011')
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return error out with 404 if requested user does not exist', function(){
            return request(app)
            .get('/v1/users/507f1f77bcf86cd799439011')
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({message: 'No such user.'})
            })
        })

        test('should return a specific user by Id', function(){
            const userData = {
                name: {
                    first: 'Alexey',
                    last: 'Milyukov',
                },
                email: 'fofofo@gmail.com',
                password: 'sdfsd34234',
                role: 'client'
            }

            let updatedUserData

            return User(userData).save()
            .then(savedData => {
                updatedUserData = userData
                delete updatedUserData.password
                updatedUserData.id = savedData.id
                return savedData._id
            })
            .then(userId => {
                return request(app)
                .get(`/v1/users/${userId}`)
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual(updatedUserData)
            })
        })
    })
})