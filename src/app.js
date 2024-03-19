const express = require('express');
const handlebars = require('express-handlebars')
const appRouter = require('./routes')

const { connectDb } = require('./config')
const { configObject } = require('./config/configObject.js');
const cookieParser = require('cookie-parser')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')

const cors = require('cors');
const socketIOfunction = require('./utils/socketIOfunction.js');
const { handleError } = require('./utils/error/handleError.js');
const { addLogger, logger } = require('./utils/logger.js');


const app = express()
const PORT = configObject.PORT

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST","PUT","DELETE"],
    credentials: true
}))

connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())



initializePassport()
app.use(passport.initialize())

app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(addLogger)
app.use(appRouter)
app.use(handleError)

const httpServer = app.listen(PORT, err => {
    if (err) logger.error(err)
    logger.info(`Escuchando en el puerto ${PORT}`)
})

const io = socketIOfunction(httpServer)