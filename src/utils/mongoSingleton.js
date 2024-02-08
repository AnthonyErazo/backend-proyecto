const { connect } = require('mongoose')


class MongoSingleton {
    static #instance

    constructor(url){
        connect(url)
    }

    static getInstance(url){
        if (this.#instance) {
            console.log('Ya está conectada')
            return this.#instance
        }

        this.#instance = new MongoSingleton(url)
        console.log('conected')
        return this.#instance
    }
}

module.exports = MongoSingleton