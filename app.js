const express = require('express');
const path = require('path');   // native node.js global utility
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // allows us to use ejs-mate for layouts and partials
const { movieSchema } = require('./schemas');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError'); // custom error class
const methodOveride = require('method-override');   // allows us to use patch/put/etc when normally it only allows get/post/etc
const Movie = require('./models/movie');     // requires our model from the 'models' folder



mongoose.connect('mongodb://localhost:27017/bcfm', {    // connects to mongo database and creates database 'bcfm'
    useNewUrlParser: true,      // parses the url???
    useUnifiedTopology: true    // mongodb driver's new connection mgmt engine???
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));   // 'binds' the error as console.error would run into trouble with the window
db.once('open', () => {
    console.log('Database connected');
});


const app = express();          // executes Express, our framework


app.engine('ejs', ejsMate);     // engines run, parse, and make sense of ejs; we need to tell it to use this one vs the default
app.set('view engine', 'ejs');  // sets our view engine to 'ejs'
app.set('views', path.join(__dirname, 'views'));    // combines 'views' with the current directory


app.use(express.urlencoded({ extended: true })); // parses the req.body
app.use(methodOveride('_method'));


const validateMovie = (req, res, next) => {
    const { error } = movieSchema.validate(req.body);   // does the actual validating
    if (error) {
        const msg = error.details.map(el => el.message).join(','); // have to map over detials since it's an array
        throw new ExpressError(msg, 400);       // sends to our error handler
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/movies', catchAsync(async (req, res) => {    // route to index page
    const movies = await Movie.find({});
    res.render('movies/index', { movies })
}));

app.get('/movies/new', (req, res) => {      // route to create new movie page
    res.render('movies/new');
})

app.post('/movies', validateMovie, catchAsync(async (req, res, next) => {   // route to create new movie and redirect to it's show page
    // if (!req.body.campground) throw new ExpressError('Invalid Movie Data', 400);
    const movie = new Movie(req.body.movie);    // creates a new document using our 'Movie' model
    await movie.save();
    res.redirect(`/movies/${movie._id}`);
}));

app.get('/movies/:id', catchAsync(async (req, res) => {    // route to a specific movie's show page
    const movie = await Movie.findById(req.params.id);
    res.render('movies/show', { movie });
}));

app.get('/movies/:id/edit', catchAsync(async (req, res) => {   // route to edit a specifict movie
    const movie = await Movie.findById(req.params.id);
    res.render('movies/edit', { movie });
}));

app.put('/movies/:id', validateMovie, catchAsync(async (req, res) => {    // route that edits movie then redirects to its show page
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(id, { ...req.body.movie });    // spread operator
    res.redirect(`/movies/${movie._id}`);
}));

app.delete('/movies/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Movie.findByIdAndDelete(id);
    res.redirect('/movies');
}));

app.all('*', (req, res, next) => {  // will catch every path not listed above
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {      // basic error handler
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {                // starts listening for port 3000
    console.log('Serving on port 3000');
})