const multer = require('multer');
const { dirname } = require('path');
const { logger } = require('./logger');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let destinationFolder = 'other';
        if (req?.query?.type == 'documents') destinationFolder = 'documents'
        if (req?.query?.type == 'profile') destinationFolder = 'profile'
        if (req?.query?.type == 'products') destinationFolder = 'products'

        callback(null, `${dirname(__dirname)}/public/uploads/${destinationFolder}`);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploader = multer({
    storage,
    onError: function (error, next) {
        logger.error(error);
        next();
    }
});

module.exports = {
    uploader
};