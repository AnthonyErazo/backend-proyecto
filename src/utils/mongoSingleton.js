const { connect } = require('mongoose')
const { logger } = require('./logger')


class MongoSingleton {
    static #instance

    constructor(url){
        connect(url)
    }

    static getInstance(url){
        if (this.#instance) {
            logger.info('Ya está conectada')
            return this.#instance
        }

        this.#instance = new MongoSingleton(url)
        logger.info('conected')
        return this.#instance
    }
}

module.exports = MongoSingleton