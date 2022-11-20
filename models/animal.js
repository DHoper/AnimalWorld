const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_100');
});

const opts = { toJSON: { virtuals: true }};

const AnimalSchema = new Schema({
    title: String,
    dangerous: Number,
    description: String,
    location: String,
    date: String,
    image: {
        type: [ImageSchema],
        required: true,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }]
}, opts);

AnimalSchema.virtual('properties').get(function () {
    return { 
        id: this._id,
        url: this.image[0].url,
        date: this.date,
        title: this.title,
        location: this.location,
        description: this.description,
    };
});

AnimalSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Animal', AnimalSchema);