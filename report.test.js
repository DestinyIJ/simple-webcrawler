const { sortPages } = require('./report')
const { test, expect } = require("@jest/globals")


// sortPage tests
test('sortPages', () => {
    const input = {
        'https://blog.boot.dev/path': 1,
        'https://blog.boot.dev': 3
    }
    const actualOutput = sortPages(input)
    const expectedOutput = [
        ['https://blog.boot.dev', 3],
        ['https://blog.boot.dev/path', 1]
    ]
    expect(actualOutput).toEqual(expectedOutput)
})