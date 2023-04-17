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

async function crawlPage (baseURL, currentURL, pages) {

    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if(baseURLObj.hostname !== currentURLObj.hostname) return pages

    const normalizedCurrentURL = normalizeUrl(currentURL)
    if(pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1


    try {
        console.log(`actively crawling: ${currentURL}`)

        const res = await fetch(currentURL)

        if(res.status > 399) {
            console.error(`error in fetch: ${res.status}, on page: ${currentURL}`)
            return pages
        }

        const contentType = res.headers.get('content-type')
        if(!contentType.includes("text/html")) {
            console.error(`not an html response, content-type: ${contentType}, on page: ${currentURL}`)
            return pages
        }
        
        
        const htmlBody = await res.text()

        const nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    } catch (error) {
        console.error(`error in fetch: ${error.message}, on page: ${currentURL}`)
    }

    return pages
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
}