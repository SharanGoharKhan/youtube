const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//configuration
const dbconfig = require('./config/db')

//models
const User = require('./models/users')

//routes
const channels = require('./routes/channels')
const accounts = require('./routes/accounts')


const app = express()
const port = process.env.PORT || 4001

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
// app.enable('trust proxy');

// // Add a handler to inspect the req.secure flag (see 
// // http://expressjs.com/api#req.secure). This allows us 
// // to know whether the request was via http or https.
// app.use(function (req, res, next) {
//     if (req.secure) {
//         // request was via https, so do no special handling
//         next();
//     } else {
//         // request was via http, so redirect to https
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });


mongoose.Promise = global.Promise
mongoose.connect(dbconfig.mongourl, { useNewUrlParser: true })

const dbconnection = mongoose.connection
dbconnection.on('error', console.error.bind(console, 'mongo db connection err: '))

//body parser middleware 
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({
//     extended: true
// }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }))

//handlebars configuration
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

//public folder path for static file like js,css,images
app.use(express.static('public'))


// routes middleware
app.use('/accounts', accounts)
app.use('/channels', channels)



app.get('/', (req, res) => {
    res.render('home')
})

app.get('/privacy', (req, res) => {
    res.render('privacy')
})


app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})