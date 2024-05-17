const MongoSingleton = require('../utils/mongoSingleton')
const { configObject } = require('./configObject')
const { logger } = require('../utils/logger')



exports.connectDb = async () => {
    try{
        MongoSingleton.getInstance(configObject.Database_mongo_Url)
        logger.info("Db connected")
    }catch (err) {
        logger.error(err)
    }
}

