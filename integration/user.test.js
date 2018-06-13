const request = require('supertest');

const dbConnect = require('../config/db_connect');
const User = require('../models/users');
jest.mock('../middleware/authenticate');

let authMock;
let connection;
let app;

afterEach(() => {
    dbConnect.teardown();
})

beforeEach(() => {
    jest.clearAllMocks()
    authMock = require('../middleware/authenticate')
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
})

describe('User', function(){
    describe('index', function(){
        test('should be auth protected', function(){
            return request(app)
            .get('/users')
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
                .get('/users')
                .expect(200)
            })
            .then(response => {
                expect(response.body).toHaveLength(usersList.length)
                //TODO fix
                expect(response.body).toEqual(createdUsers.reverse())
            })
        })
    })

    describe('show', function(){
        test('should be auth protected', function(){
            return request(app)
            .get('/users/507f1f77bcf86cd799439011')
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return error out with 404 if requested user does not exist', function(){
            return request(app)
            .get('/users/507f1f77bcf86cd799439011')
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
                role: 'Client'
            }

            let updatedUserData

            return User(userData).save()
            .then(savedData => {
                updatedUserData = userData
                updatedUserData.password = savedData.password
                updatedUserData.id = savedData.id
                return savedData._id
            })
            .then(userId => {
                return request(app)
                .get(`/users/${userId}`)
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual(updatedUserData)
            })
        })
    })
})