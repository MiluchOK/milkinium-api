const request = require('supertest');

const dbConnect = require('../config/db_connect');
const User = require('../models/users');
// jest.mock('../middleware/authenticate');

// let authMock;
let connection;
let app;
let user;

afterEach(() => {
    dbConnect.teardown();
})

beforeEach(() => {
    jest.clearAllMocks()
    authMock = require('../middleware/authenticate')
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
})

describe('Authentication', function(){
    describe('post', function(){
        describe('valid credentials', function(){
            test('should return an auth token', function(){
                const newUser = User.createRandom()
                return request(app)
                .get('/v1/authenticate')
                .expect(200)
                .then((response) => {
                    expect(response.body).toHaveProperty("token")
                })
            })
        })

        describe('invalid credentials', function(){
            test('should throw an error', function(){
                
            })
        })
    })
})