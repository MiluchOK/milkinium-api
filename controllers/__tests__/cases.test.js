const mockingoose = require('mockingoose').default;
const controller = require('../cases')
var MockExpressRequest = require('mock-express-request');
var MockExpressResponse = require('mock-express-response');

describe('Cases', function () {
    test('should be creatable', function() {
        // mockReq = {
        //     params: {
        //         projectId: 1
        //     },
        //     body: {
                
        //     }
        // }

        // json_mock = jest.fn()
        // status_mock = jest.fn()
        //     .mockReturnValue({
        //         json: json_mock
        //     })

        // mockRes = {
        //     status: status_mock
        // }

        // Mocks
        const mockNext = jest.fn();
        const mockReq = new MockExpressRequest({
            params: {
                projectId: 111
            },
            body: {
                project: {
                    project: 111
                }
            }
        });
        const mockRes = new MockExpressResponse();

        mockingoose.Case.toReturn({name: 'foo'}, 'save')

        const result = controller.create(mockReq, mockRes, mockNext)

        return result
        .then(() => {
            // expect(status_mock.mock.calls.length).toBe(1);
            // expect(json_mock.mock.calls.length).toBe(1);
            // expect(mockNext.mock.calls.length).toBe(0);
            expect(mockRes.statusCode).toBe(201)
            // expect(mockRes._getJSON()).toBe({})
        })
    })
});