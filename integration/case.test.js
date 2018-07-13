const request = require('supertest');

const dbConnect = require('../config/db_connect');
const Case = require('../models/projects');
jest.mock('../middleware/authenticate');

let authMock;
let app;

afterEach(() => {
    return dbConnect.teardown();
})

beforeEach(() => {
    jest.clearAllMocks()
    authMock = require('../middleware/authenticate')
    app = require('../app')
    return dbConnect.connect(global.__MONGO_URI__)
})

describe('Case', function(){
    describe('index', function(){

        const endpoint = `/v1/projects/${projectId}/cases`

        test('should be protected', function(){
            return request(app)
            .get(endpoint)
            .then(() => {
                expect(authMock.authMid.mock.calls.length).toBe(1)
            })
        })

        test('should return all cases', function(){
            let createdCases;
            return Promise.all([Case.createRandom(), Case.createRandom()])
            .then((cases) => {
                createdCases = cases.map((p) => { return p.toJSON() })
                return request(app)
                .get(endpoint)
                .expect(200)
            })
            .then((response) => {
                expect(response.body).toHaveLength(createdProjects.length)
                const sorter = (a, b) => { return ((a.title < b.title) ? -1 : ((a.title > b.title) ? 1 : 0)) }
                expect(response.body.sort(sorter)).toEqual(createdCases.sort(sorter))
            })
        })
    })
})