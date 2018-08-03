const dbConnect = require('../../config/db_connect');

beforeEach(() => {
    return dbConnect.connect(global.__MONGO_URI__)
})

afterEach(() => {
    return dbConnect.teardown()
})