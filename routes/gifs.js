const express = require('express');
const multer = require('../middleware/multer-config');

const router = express.Router();

const auth = require('../middleware/auth');

const gifsCtrl = require('../controllers/gifs');

router.post('/', auth.isAuthorized, multer, gifsCtrl.createGif);
router.put('/:id', auth.isAuthorized, multer, gifsCtrl.updateGif);

router.get('/', auth.isAuthorized, gifsCtrl.getGif);
router.get('/:id', auth.isAuthorized, gifsCtrl.getGifsById);

router.delete('/:id', auth.isAuthorized, gifsCtrl.deleteGif);

router.post('/:id/comment', auth.isAuthorized, gifsCtrl.gifComment);

module.exports = router;
