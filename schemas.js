const Joi = require('joi'); // JS validator tool

module.exports.movieSchema = Joi.object({     // not a mongoose schema, valdiates it before it gets to mongoose
    movie: Joi.object({
        title: Joi.string().required(),
        year: Joi.number().required().min(1888),
        nominator: Joi.string(),
        tagline: Joi.string(),
        posterUrl: Joi.string().required().uri()
    }).required()
});