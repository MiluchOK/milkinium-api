const allModels = require('../index')

describe('All Models', function () {
    Object.keys(allModels).forEach(model => {
        test(`${model} should have 'createRandom' methods`, function(){
            expect(allModels[model]).toHaveProperty('createRandom')
        })

        test(`${model} should have 'sureFindById' methods`, function(){
            expect(allModels[model]).toHaveProperty('sureFindById')
        }) 
    });
})