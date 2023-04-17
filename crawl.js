const { JSDOM } = require('jsdom')

function normalizeUrl(urlString) {
    const urlObj = new URL(urlString)
    let urlPath = `${urlObj.hostname}${urlObj.pathname}`
    if(urlPath.length > 0 && urlPath.slice(-1) === '/') {
        urlPath = urlPath.slice(0, -1)
    }
    return urlPath
}

function getURLsFromHTML(htmlbody, baseURL) {
    const urls = []

    let baseLink = baseURL
    if(baseURL.slice(-1) === '/') baseLink = baseURL.slice(0,-1)

    const htmlDom = new JSDOM(htmlbody)
    const linkElements = htmlDom.window.document.querySelectorAll('a') 
    for (const linkElement of linkElements) {
        let link = linkElement.href
        if(link.slice(-1) === '/') link = link.slice(0,-1) 

        if(!link.includes('https') && !link.includes('http')) {
            if(link.startsWith('/')) {
                link = `${baseLink}${link}`
            } else {
                continue
            }
            
        }
        urls.push(link)
    }

    return urls
}

async function crawlPage (currentURL) {
    console.log(`actively crawling: ${currentURL}`)

    try {
        const res = await fetch(currentURL)

        if(res.status > 399) {
            console.error(`error in fetch: ${res.status}, on page: ${currentURL}`)
            return
        }

        const contentType = res.headers.get('content-type')
        if(!contentType.includes("text/html")) {
            console.error(`not an html response, content-type: ${contentType}, on page: ${currentURL}`)
            return
        }
        console.log(await res.text())

    } catch (error) {
        console.error(`error in fetch: ${error.message}, on page: ${currentURL}`)
    }
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
}