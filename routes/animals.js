const express = require('express');
const catchAsync = require('../utils/catchAsync.js');
const animalsCtr = require('../controllers/animals');
const { loginValidator, authorValidator, validateAnimal } = require('../middleware.js');//需用解構，否則會獲取到整個對象並在掛載為中間件時產生錯誤//

const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');//會自動搜索index檔名的文件//
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(animalsCtr.index))
    .post(loginValidator, upload.array('image'), validateAnimal, catchAsync(animalsCtr.addPost));

router.get('/add', loginValidator, animalsCtr.add);

router.route('/:id')
    .get(catchAsync(animalsCtr.detail))
    .put(loginValidator, 
         authorValidator,
         upload.array('image'), 
         validateAnimal, 
         catchAsync(animalsCtr.editPut))
    .delete(loginValidator, authorValidator, catchAsync(animalsCtr.delete));

router.get('/:id/edit', loginValidator, authorValidator, catchAsync(animalsCtr.edit));


module.exports = router;


