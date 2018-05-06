const controller = require('../cases')

describe('Cases', function () {
    test('should be creatable', function() {
        controller.create(mockReq, mockRes, mockNext)
    })
});