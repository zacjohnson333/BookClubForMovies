module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next); // .catch(next) is shorthand for .catch(e => next(e))
    }
}