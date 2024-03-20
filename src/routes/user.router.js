const { Router } = require('express');
const UserController = require('../controller/user.controller');

const {
    userRoleChange
} = new UserController()

const router = Router();

router
    .post('/premium/:uid', userRoleChange);

module.exports = router;