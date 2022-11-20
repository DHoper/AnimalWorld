const cities = require('./cities');
const { sort, descriptors, img } = require('./seedHelpers');
const Animal = require('../models/animal');

const mongoose = require('mongoose');
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/animal-world');
}
main().then(solved => console.log(solved, "success!!!"))
      .catch(err => console.log(err));


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Animal.deleteMany({});
    // for (let i = 0; i < 300; i++) {
    //     const random1000 = Math.floor(Math.random() * 1000);
    //     const dangerous = Math.floor(Math.random() * 100);
    //     const imgNumber = Math.floor(Math.random() * 28);
    //     const animal = new Animal({

    //         author: '637317e2d1bd674220fd54df',
    //         title: `${sample(descriptors)}${sample(sort)}`,
    //         dangerous: dangerous,
    //         location: `${cities[random1000].city}, ${cities[random1000].state}`,
    //         description: "今為止所發現的最古老的犀牛化石是在始新世早期的地層中挖掘出來的貘犀[2]，此種犀牛的祖先與現代貘類的大小差不多，犀牛祖先之一種森林犀牛在歐洲曾廣泛存在過，個體很小而且善於奔跑。",
    //         image: {
    //             url: img[imgNumber],
    //             filename: "Animal-World/bzz4cfxcp9vx4c120z0v",
    //         },
    //     })
    //     await animal.save();
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})