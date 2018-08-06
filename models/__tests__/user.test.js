const User = require('../../models/users');

const validUserData = {
    name: {
        first: 'Alex',
        last: 'Foo'
    },
    email: 'examplemail@gmail.com',
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

   test('should strip out password when converted to json', function(){
       const validUserJSON = new User(validUserData).toJSON()
       console.log(typeof validUserJSON.id)
       expect(validUserJSON).toEqual({
           id: expect.any(String),
           email: validUserData.email,
           name: {
               first: validUserData.name.first,
               last: validUserData.name.last
           },
           role: validUserData.role,
           avatar: validUserData.avatar
       })
   })

   test('should not allow malformed emails', function(done){
       const data = Object.assign(validUserData, {email: 'foo'})
       const userWithBrokenEmail = new User(data)
       userWithBrokenEmail.validate()
       .catch(err => {
           expect(err.errors['email']).toBeTruthy()
           done()
       })
   })
});