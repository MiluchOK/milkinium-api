const controller = require('../users')
const mockingoose = require('mockingoose').default;

describe('Users', function () {
    test('should be creatable', function() {

        const _user_doc = {
            _id: '507f191e810c19729de860ea',
            first_name: 'firstName',
            last_name: 'lastName',
            email: 'name@email.com'
        };

        // mockingoose.User.toReturn(_user_doc, 'save');

        const mockReq = {
            body: _user_doc
        };
        const mockRes = jest.fn();
        const mockNext = jest.fn();

        

        controller.create(mockReq, mockRes, mockNext)
        // expect(mockReq).toBeCalledWith(expect.anything());
    })
});