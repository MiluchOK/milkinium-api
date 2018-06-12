const request = require('supertest');
jest.mock('../middleware/authenticate');
const dbConnect = require('../config/db_connect')

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
        test('should return error out with 404 if requested user does not exist', function(){
            return request(app)
            .get('/users/507f1f77bcf86cd799439011')
            .expect(404)
            .then(response => {
                expect(response.body).toEqual({message: 'No such user.'})
            })
        })
    })
})