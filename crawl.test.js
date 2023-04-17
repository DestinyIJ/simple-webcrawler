const { normalizeUrl, getURLsFromHTML } = require('./crawl')
const { test, expect } = require("@jest/globals")


// normalize url tests
test('normalizeUrl strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actualOutput = normalizeUrl(input)
    const expectedOutput = 'blog.boot.dev/path'
    expect(actualOutput).toEqual(expectedOutput)
})

test('normalizeUrl strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actualOutput = normalizeUrl(input)
    const expectedOutput = 'blog.boot.dev/path'
    expect(actualOutput).toEqual(expectedOutput)
})

test('normalizeUrl lowercase url', () => {
    const input = 'https://BLOG.boot.dev/path/'
    const actualOutput = normalizeUrl(input)
    const expectedOutput = 'blog.boot.dev/path'
    expect(actualOutput).toEqual(expectedOutput)
})

test('normalizeUrl strip protocol', () => {
    const input = 'http://blog.boot.dev/path/'
    const actualOutput = normalizeUrl(input)
    const expectedOutput = 'blog.boot.dev/path'
    expect(actualOutput).toEqual(expectedOutput)
})


// getURLsFromHTML tests
test('getURLsFromHTML absolute urls', () => {
    const inputHTMLbody = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <a href="https://blog.boot.dev">Boot Dev Blog</a>
    </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseURL)
    const expectedOutput = ['https://blog.boot.dev']
    expect(actualOutput).toEqual(expectedOutput)
})

test('getURLsFromHTML relative urls', () => {
    const inputHTMLbody = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <a href="/about-page/">Boot Dev Blog</a>
    </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseURL)
    const expectedOutput = ['https://blog.boot.dev/about-page']
    expect(actualOutput).toEqual(expectedOutput)
})

test('getURLsFromHTML mutltiple urls', () => {
    const inputHTMLbody = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <a href="http://blog.boot.dev">Boot Dev Blog</a>
        <a href="https://blog.boot.dev">Boot Dev Blog</a>
        <a href="/about-page/">About</a>
        <a href="/contact-us">Contact</a>
    </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseURL)
    const expectedOutput = ['http://blog.boot.dev', 'https://blog.boot.dev', 'https://blog.boot.dev/about-page', 'https://blog.boot.dev/contact-us']
    expect(actualOutput).toEqual(expectedOutput)
})

test('getURLsFromHTML check invalid', () => {
    const inputHTMLbody = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <a href="invalid1">invalid1</a>
        <a href="http://blog.boot.dev">Boot Dev Blog</a>
        <a href="https://blog.boot.dev">Boot Dev Blog</a>
        <a href="/about-page/">About</a>
        <a href="/contact-us">Contact</a>
        <a href="invalid2">invalid2</a>
    </body>
    </html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actualOutput = getURLsFromHTML(inputHTMLbody, inputBaseURL)
    const expectedOutput = ['http://blog.boot.dev', 'https://blog.boot.dev', 'https://blog.boot.dev/about-page', 'https://blog.boot.dev/contact-us']
    expect(actualOutput).toEqual(expectedOutput)
})