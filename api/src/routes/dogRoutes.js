const { Router } = require('express');
const { createDog, getAllDogs } = require('../controllers/dogController');

const router = Router();

router.get('/', getAllDogs).post('/', createDog);

module.exports = router;
