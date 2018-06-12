const request = require('supertest');
jest.mock('../middleware/authenticate');
const dbConnect = require('../config/db_connect')
const User = require('../models/users');

let connection;
let app;

beforeAll(() => {
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
})

afterAll(() => {
    dbConnect.teardown()
})

describe('User', function(){
    describe('index', function(){
        xtest('should be auth protected', function(){

        })

        test('should return all users', function(){
            return request(app)
            .get('/users')
            .expect(200)
            .then(response => {
                expect(response.body).toEqual([])
            })
        })
    })

    describe('show', function(){
        xtest('should be auth protected', function(){

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
                console.log(response.body)
                expect(response.body).toEqual(updatedUserData)
            })
        })
    })
})