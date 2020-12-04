const makeMessage = (name, message) => {
    return {
        name,
        message,
        date: new Date().getTime()
    }
}

module.exports = {
    makeMessage
}