

const nextMock = () => {
    jest.fn()

    mockNext.mockImplementation((error) => {
        throw error
    })
}

export default nextMock()