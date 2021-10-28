// this file needs to be run on it's own, apart from our node app, any time we want to seed the database

const mongoose = require('mongoose');
const movieList = require('./movielist');
const Movie = require('../models/movie');   // in a separte dir so we need to backout first


mongoose.connect('mongodb://localhost:27017/bcfm', {    // connects to mongo database and creates database 'bcfm'
    useNewUrlParser: true,      // parses the url???
    useUnifiedTopology: true    // mongodb driver's new connection mgmt engine???
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));   // 'binds' the error as console.error would run into trouble with the window
db.once('open', () => {
    console.log('Database connected');
});

const seedDB = async () => {
    await Movie.deleteMany({});
    for (let i = 0; i < movieList.length; i++) {
        const movie = new Movie({
            title: `${movieList[i].title}`,
            year: `${movieList[i].year}`,
            nominator: `${movieList[i].nominator}`,
            rtScore: `${movieList[i].rtScore}`,
            posterUrl: `${movieList[i].posterUrl}`,
            tagline: `${movieList[i].tagline}`
        })
        await movie.save();
    }
}

seedDB().then(() => { // executes the seeding
    mongoose.connection.close();
    console.log('Database disconnected');
});