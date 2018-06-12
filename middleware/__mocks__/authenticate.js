const main = jest.fn(((req, res, next) => { next() }))

main.unless = jest.fn().mockReturnValue(
    main
)

module.exports = {
    authMid: main
}