const { Router } = require('express');
const UserController = require('../controller/user.controller');
const { uploader } = require('../utils/uploader');

const {
    userRoleChange,
    deleteUser,
    getDataUser,
    userDocuments,
    getUsers,
    deleteUserInactive
} = new UserController()

const router = Router();

router
    .post('/premium/:uid', userRoleChange)
    .post('/:uid/documents',uploader.array('file'), userDocuments)
    .delete('/:uid', deleteUser)
    .delete('/', deleteUserInactive)
    .get('/', getUsers)
    .get('/:uid', getDataUser);

module.exports = router;