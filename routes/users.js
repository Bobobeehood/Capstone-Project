const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/adminCheck');

const userCtrl = require('../controllers/users');

router.post('/signin', userCtrl.login);

router.get('/users', auth.isAuthorized, userCtrl.getUsers);
router.get('/users/:id', auth.isAuthorized, userCtrl.getUserById);

router.post('/create-user', auth.isAuthorized, admin.isAdmin, userCtrl.createUser);
router.put('/users/:id', auth.isAuthorized, admin.isAdmin, userCtrl.updateUser);
router.delete('/users/:id', auth.isAuthorized, admin.isAdmin, userCtrl.deleteUser);

module.exports = router;
