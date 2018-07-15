const User = require('../../models/users');

const validUserData = {
    name: {
        first: 'Alex',
        last: 'Foo'
    },
    email: 'exampleMail@gmail.com',
    role: 'client',
    avatar: 'http://fooo.com?someimage=1',
    password: 'tesT1234'
}


const requiredFields = ['email', 'password', 'name']

describe('Users', function () {

    test('should allow to create a valid user', function(){
        return new User(validUserData).validate()
    })


    requiredFields.forEach((field) => {
        it(`should not allow to create a user without required '${field}' field`, (done) => {
            let invalidUserData = Object.assign({}, validUserData)
            delete invalidUserData[field]
            new User(invalidUserData).validate()
            .catch((err) => {
                expect(err.errors[field]).toBeTruthy()
                done()
            })
        })
   })
});