const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MovieSchema = new Schema({    // creates a schame with these properties
    title: String,
    year: Number,
    director: String,
    topBilled: String,
    country: String,
    nominator: String,
    rtScore: Number,
    genres: String,
    posterUrl: String,
    tagline: String
});

// compile our model with the name 'Movie' using the schema 'MovieSchema' then exports it
module.exports = mongoose.model('Movie', MovieSchema);