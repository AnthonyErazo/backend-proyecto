const { configObject } = require('../config/configObject');
const multer = require('multer');
const admin = require('firebase-admin');
const { dirname } = require('path');
const { logger } = require('./logger');

const serviceAccount = JSON.parse(configObject.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: configObject.storageBucket
});
const firebaseBucket = admin.storage().bucket();

const uploadToFirebase = async (file) => {
    const filename = `${Date.now()}-${file.originalname}`;
    const fileBuffer = file.buffer;

    const fileRef = firebaseBucket.file(filename);
    const metadata = { contentType: file.mimetype };

    await fileRef.save(fileBuffer, { metadata });

    const url = await fileRef.getSignedUrl({ action: 'read', expires: '01-01-2030' });

    return url;
};

const storageFirebase = multer.memoryStorage();
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
const uploaderFirebase = multer({
    storage:storageFirebase,
    onError: function (error, next) {
        logger.error(error);
        next();
    }
});

module.exports = {
    uploader,
    uploaderFirebase,
    uploadToFirebase
};