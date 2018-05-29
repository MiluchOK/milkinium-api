const Project = {}

const findWithCases = jest.fn(() => Promise.resolve({}))

Project.findWithCases = findWithCases


module.exports = Project;