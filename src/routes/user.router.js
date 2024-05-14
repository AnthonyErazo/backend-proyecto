const { Router } = require('express');
const UserController = require('../controller/user.controller');
const { uploader } = require('../utils/uploader');
const { isUser, isAdmin } = require('../middleware/verifiqueRole.middleware');

const {
    userRoleChange,
    deleteUser,
    getDataUser,
    userDocuments,
    getUsers,
    deleteUserInactive,
    donwloadDocuments
} = new UserController()

const router = Router();

router
    .post('/premium/:uid', isAdmin,userRoleChange)
    .delete('/', isAdmin,deleteUserInactive)
    .delete('/:uid', isAdmin,deleteUser)
    .get('/', isAdmin,getUsers)
    .post('/:uid/documents',isUser,uploader.array('file'), userDocuments)
    .get('/:uid', getDataUser)
    .get('/documents/:uid', isAdmin,donwloadDocuments);

module.exports = router;