const cases = require('./cases.json')

const Project = {}

const findWithCases = jest.fn(() => Promise.resolve(cases))

// const findWithCases = jest.fn(() => { 
//     function(){
//     return (new Promise(function(resolve, reject){
//         console.log("To fail or not to fail")
//         if(false) {
//             reject(new Error("Failing."))
//         }
//         else{
//             resolve(cases)
//         }
//     }))
// }

Project.findWithCases = findWithCases


module.exports = Project;