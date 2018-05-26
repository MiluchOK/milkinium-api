const cases = require('./cases.json')

module.exports = {
    findWithCases: function(){
        return (new Promise(function(resolve, reject){
            resolve(cases)
        }))
    }
};