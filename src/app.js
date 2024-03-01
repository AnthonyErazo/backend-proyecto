const express = require('express');
const handlebars = require('express-handlebars')
const appRouter = require('./routes')

const { connectDb, configObject } = require('./config')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')

const cors=require('cors');
const socketIOfunction = require('./utils/socketIOfunction.js');


const app = express()
const PORT = configObject.PORT


connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser(configObject.Cookie_word_secret))
app.use(cors())

initializePassport()
app.use(passport.initialize())

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    allowProtoPropertiesByDefault:true,
    allowProtoMethodsByDefault:true,
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')


app.use(appRouter)

const httpServer = app.listen(PORT, err => {
    if (err) console.log(err)
    console.log(`Escuchando en el puerto ${PORT}`)
})

const io=socketIOfunction(httpServer)