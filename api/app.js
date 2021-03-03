const express = require('express')
const app = express()
const path = require('path')
var coursesRouter = require('./controllers/courses')
var professorsRouter = require('./controllers/professors')
var scheduleRouter = require('./controllers/schedule')
var reviewsRouter = require('./controllers/reviews')

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'build')));

/**
 * Inference:
 * 
 * When "inference" in serverless.yml is "true", the Serverless Framework will attempt to
 * initialize this application on every deployment, extract its endpoints and generate an OpenAPI specification (super cool)
 * However, the Framework won't have access to the environment variables, causing some things to crash on load.
 * That is why some things have try/catch blocks around them when they are required.
 */


/**
 * Configure Express.js Middleware
 */

// Enable CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('x-powered-by', 'serverless-express')
  next()
})

// Enable JSON use
app.use(express.json())

// Since Express doesn't support error handling of promises out of the box,
// this handler enables that
const asyncHandler = fn => (req, res, next) => {
  return Promise
    .resolve(fn(req, res, next))
    .catch(next);
};



app.use("/courses", coursesRouter);
app.use("/professors", professorsRouter);
app.use("/schedule", scheduleRouter);
app.use("/reviews", reviewsRouter);

app.use('/about', (req, res) => {
  res.render('about');
});

/**
 * Routes - Public
 */

app.options(`*`, (req, res) => {
  res.status(200).send()
})

app.get(`/test/`, (req, res) => {
  res.status(200).send('Request received')
})


/**
 * Routes - Catch-All
 */

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../site/build/index.html'));
});

/**
 * Error Handler
 */
app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).json({ error: `Internal Serverless Error - "${err.message}"` })
})

module.exports = app