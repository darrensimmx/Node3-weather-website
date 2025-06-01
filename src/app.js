const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express() //to use the express fn, unlike other lib, express is one fn, not an obj 
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectioryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Set up static directory to serve
app.use(express.static(publicDirectioryPath))

app.get('', (req, res) => {
    res.render('index', {
        title : 'Weather App',
        name: 'Darren'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'HELP MESSAGE',
        title: 'Help',
        name: "darren"
    })
}) //.get to choose what to do for next directory on browser

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Darren'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address
    console.log(address) //debug
    if (!address) {
        return res.send({
            error: "You must provide an address"
        }) 
    }

    geocode(address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }
            
            //recall location and address shorthand if names are identical
            res.send({
                forecast: forecastData,
                location,
                address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) { //error check for valid search
        return res.send({ //return ensures that the code stops here 
            error: "You must provide a search term"
        })
    }
    console.log(req.query.search)
    res.send({
        "products": []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Darren',
        errorMessage: 'Help Article Not Found'
    })
})

app.get('*', (req, res) => { // * is a wildcard to match anything that hasn't been matched thus far
    res.render('404', {
        title: '404',
        name: 'Darren',
        errorMessage: 'Page Not Found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port) // not gonna display on browser, but a useful info
}) //used only once, to start a server