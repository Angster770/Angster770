if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
//
const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Ganisrael = require('../models/ganisrael')
    ///
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

mongoose.connect('mongodb://localhost:27017/gan-israel')
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, NO MONGO CONNECTION!!!!")
        console.log(err)
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async() => {
    await Ganisrael.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[rand1000].city}, ${cities[rand1000].state}`
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const gan = new Ganisrael({
            author: '61ba2ed074e6f50f9ff951a0',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium, animi architecto mollitia repellat ex quia sequi asperiores soluta dolorem suscipit, maiores laudantium, rem officia? Dignissimos ut harum accusamus ad velit.',
            price,
            geometry: geoData.body.features[0].geometry,
            images: [{
                    url: 'https://res.cloudinary.com/dzmgiq9rb/image/upload/v1639954311/GanIsrael/fhajcdxygsuqvqhztme8.png',
                    filename: 'GanIsrael/fhajcdxygsuqvqhztme8'
                }, {
                    url: 'https://res.cloudinary.com/dzmgiq9rb/image/upload/v1639954309/GanIsrael/lpj3wu03smjiw2vfrsse.png',
                    filename: 'GanIsrael/lpj3wu03smjiw2vfrsse',
                },

            ],
        })
        await gan.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});