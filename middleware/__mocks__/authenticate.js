const main = jest.fn()

main.unless = jest.fn().mockReturnValue(
    jest.fn((req, res, next) => { 
        next() 
    })
)

module.exports = {
    authMid: main
}