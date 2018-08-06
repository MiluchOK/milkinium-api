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

        let endpoint = (userId) => (`/v1/users/${userId}`)

        test('should be auth protected', function(){
            return request(app)
            .get(endpoint('507f1f77bcf86cd799439011'))
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should error out with 404 if requested user does not exist', function(){
            return request(app)
            .get(endpoint('507f1f77bcf86cd799439011'))
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

            return User(userData).save()
            .then(savedUser => {
                return request(app)
                .get(endpoint(savedUser._id))
                .expect(200)
            })
            .then(response => {
                const returnedUser = response.body
                expect(returnedUser).toEqual({
                    id: expect.any(String),
                    name: {
                        first: userData.name.first,
                        last: userData.name.last
                    },
                    email: userData.email,
                    role: userData.role
                })
            })
        })
    })


    describe('create', function(){

        let endpoint = `/v1/users`

        test('should be auth protected', function(){
            return request(app)
            .post(endpoint)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should create a valid user', function(){
            const newUserData = User.createRandomData()
            return request(app)
            .post(endpoint)
            .send(newUserData)
            .expect(201)
            .then((response) => {
                const createdUser = response.body
                expect(createdUser).toEqual({
                    id: expect.any(String),
                    name: {
                        first: newUserData.name.first,
                        last: newUserData.name.last
                    },
                    email: newUserData.email,
                    role: newUserData.role
                })
            })
        })

        test.only('should not allow to create a user with a clamed email', function(){
            return User.createRandom()
            .then(user => {
                return user.email
            })
            .then(claimedEmail => {
                const claimedData = User.createRandomData({email: claimedEmail})
                return request(app)
                .post(endpoint)
                .send(claimedData)
                .expect(422)
            })
            .then(response => {
                expect(response.body.error).toEqual("Cannot have duplicate email")
            })
        })
    })
})