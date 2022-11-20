const joi = require('joi');

module.exports.animalSchema = joi.object({
    title: joi.string().required(),
    dangerous: joi.number().required().max(100).min(0),
    location: joi.string().required(),
    // image: joi.string().required(),
    description: joi.string().required(),
    delImages: joi.array(),
}).required();

module.exports.reviewSchema = joi.object({
    rating: joi.number().required().max(5).min(1),
    content: joi.string().required(),
}).required();