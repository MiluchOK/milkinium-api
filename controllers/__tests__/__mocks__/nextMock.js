

const nextMock = () => {
    const mockNext = jest.fn()
    mockNext.mockImplementation((error) => {
        throw error
    })
    return mockNext
}

module.exports = nextMock()
