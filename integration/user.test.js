const request = require('supertest');
const app = global.__APP__

describe('User', function(){
    test('index', function(){
        return request(app)
            .get('/user')
            .expect(200)
            .then(response => {
                expect(response.body).toBe([])
            })
    })
})