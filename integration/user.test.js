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
                createdUsers = users.map((u) => (u.toJSON())).map((u) => {
                    u.id = String(u.id)
                    return u
                })
                return request(app)
                .get('/v1/users')
                .expect(200)
            })
            .then(response => {
                expect(response.body).toHaveLength(usersList.length)
                const sorter = (a, b) => { return ((a.email < b.email) ? -1 : ((a.email > b.email) ? 1 : 0)) }
                console.log(createdUsers.sort(sorter)[0].id)
                expect(response.body.sort(sorter)).toEqual(createdUsers.sort(sorter))
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
                .get(`/v1/users/${userId}`)
                .expect(200)
            })
            .then(response => {
                expect(response.body).toEqual(updatedUserData)
            })
        })
    })
})