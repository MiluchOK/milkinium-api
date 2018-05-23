const mockingoose = require('mockingoose').default;
const controller = require('../cases')

describe('Cases', function () {
    test('should be creatable', function() {
        mockReq = {
            params: {
                projectId: 1
            },
            body: {
                
            }
        }

        json_mock = jest.fn()
        status_mock = jest.fn()
            .mockReturnValue(json_mock)

        mockRes = {
            status: status_mock
        }

        mockNext = jest.fn()

        mockingoose.Case.toReturn({name: 'foo'}, 'save')

        const result = controller.create(mockReq, mockRes, mockNext)
        expect(status_mock.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls.length).toBe(0);
    })
});