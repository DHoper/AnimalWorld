const express = require('express');
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync.js');
const reviewsCtr = require('../controllers/reviews');
const { validateReview, reviewLoginValidator, reviewAuthorValidator } = require('../middleware.js');



router.post('/', reviewLoginValidator, validateReview, catchAsync(reviewsCtr.post));
router.delete('/:reviewId', reviewLoginValidator, reviewAuthorValidator, catchAsync(reviewsCtr.delete));

module.exports = router;