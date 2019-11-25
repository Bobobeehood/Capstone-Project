const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const classCtrl = require('../controllers/class');

router.get('/', auth, classCtrl.getClass);
router.post('/', auth, multer, classCtrl.createClass);
router.get('/:id', auth, classCtrl.getClassById);
router.put('/:id', auth, multer, classCtrl.updateClass);
router.delete('/:id', auth, classCtrl.deleteClass);

module.exports = router;