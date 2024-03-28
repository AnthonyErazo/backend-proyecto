const { Router } = require('express');
const UserController = require('../controller/user.controller');

const {
    userRoleChange,
    deleteUser,
    getDataUser
} = new UserController()

const router = Router();

router
    .post('/premium/:uid', userRoleChange)
    .delete('/:uid', deleteUser)
    .get('/:uid', getDataUser);

module.exports = router;