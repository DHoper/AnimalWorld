const Animal = require('../models/animal');
const Review = require('../models/review');

module.exports.post = async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date().toLocaleDateString('zh-TW', options);
    review.date = date;
    animal.reviews.push(review);
    await review.save();
    await animal.save();
    console.log(review.date);
    req.flash('success',"發佈成功 !");
    res.redirect(`/animals/${animal._id}`);
}

module.exports.delete = async (req, res) => {
    const { id, reviewId} = req.params;
    await Animal.findByIdAndUpdate(id, {$pull: { reviews: reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success',"刪除成功 !");
    res.redirect(`/animals/${id}`);
}