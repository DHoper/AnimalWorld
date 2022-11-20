const { animalSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/expressError.js');
const Animal = require('./models/animal');
const Review = require('./models/review');

module.exports.loginValidator = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.targetUrl = req.originalUrl;
        req.flash('error', "請先登錄!")
        return res.redirect('/login');
    }
    next();
}

module.exports.reviewLoginValidator = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.targetUrl = `animals/${req.params.id}`;
        req.flash('error', "請先登錄!")
        return res.redirect('/login');
    }
    next();
}

module.exports.validateAnimal = (req, res, next) => {
    const { error } = animalSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg)
    }else {
        next();
    }
}

module.exports.authorValidator = async(req, res, next) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if(!animal.author.equals(req.user._id)) {
        req.flash('error', "無存取權限。");
        return res.redirect(`/animals/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg)
    }else {
        next();
    }
}

module.exports.reviewAuthorValidator = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', "無存取權限。");
        return res.redirect(`/animals/${id}`)
    }
    next();
}

