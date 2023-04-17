const { crawlPage } = require('./crawl')

function main () {
    if(process.argv.length < 3) {
        console.log('No website Provided')
        process.exit(1)
    }
    if(process.argv.length > 3) {
        console.log('Too many command line arguments')
        process.exit(1)
    }

    const baseUrl = process.argv[2]

    console.log(`Starting crawl of ${baseUrl}`)
    crawlPage(baseUrl)

}

main()