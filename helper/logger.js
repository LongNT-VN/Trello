const logger = (title) =>{
    return info = (infomation) => {
        console.log(`[${title}] ${infomation}`)
    }
}

module.exports = logger;