const Animal = require('../models/animal');
const User = require('../models/user');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});

module.exports.index = async (req, res) => {
    const animals = await Animal.find({}).populate('author');
    res.render('animal/index', { animals });
}

module.exports.detail = async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!animal) {
        req.flash('error', "找不到該文章");
        return res.redirect('/animals');
    }
    res.render('animal/detail', { animal });
}

module.exports.add = (req, res) => {
    res.render('animal/add');
}

module.exports.addPost = async (req, res) => {
    const animal = new Animal(req.body);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1,
    }).send();
    animal.geometry = geoData.body.features[0].geometry;
    animal.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    animal.author = req.user._id;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date().toLocaleDateString(undefined, options);
    animal.date = date;
    await animal.save();
    req.flash('success', "發佈成功 !");
    res.redirect(`/animals/${animal._id}`);
}

module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findById(id);
    if (!animal) {
        req.flash('error', "找不到該文章");
        return res.redirect('/animals');
    }
    res.render('animal/edit', { animal });
}

module.exports.editPut = async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date().toLocaleDateString(undefined, options);
    animal.date = date;
    if (req.files.length > 0) {
        const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
        animal.image.push(...img);
    }
    await animal.save();
    if (req.body.delImages && (animal.image.length - req.body.delImages.length) > 0) {
        
        for (let filename of req.body.delImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await animal.updateOne({ $pull: { image: { filename: { $in: req.body.delImages } } } });

    }else if(req.body.delImages && (animal.image.length - req.body.delImages.length) <= 0)  {

        req.flash('error', "請至少保留一張圖片 !");
        return res.redirect(`/animals/${id}/edit`);
    }
    
    req.flash('success', "編輯成功 !");
    res.redirect(`/animals/${id}`);
}

module.exports.delete = async (req, res) => {
    const { id } = req.params;
    const animal = await Animal.findByIdAndDelete(id);
    for (let image of animal.image) {
        await cloudinary.uploader.destroy(image.filename);
      } 
    req.flash('success', "刪除成功 !");
    res.redirect('/animals');
}