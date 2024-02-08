const dotenv=require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const MongoSingleton = require('../utils/mongoSingleton')

dotenv.config()

// PORT=8080
// Admin_user_email=adminCoder@coder.com
// Admin_user_password=adminCod3r123
// Jwt_private_key=secretword
// Github_client_Id=Iv1.e7d6f54064887e25
// Github_client_Secret=ddb3814b2a5324be76b1a89f122f51f6730774f2
// Github_callback_Url=http://localhost:8080/api/sessions/githubcallback
// Cookie_word_secret=p@l@br@seCret@
// Cookie_auth=token
// Database_mongo_Url=mongodb+srv://anthonyerazo76:anthonyerazo76@cluster0.gzll4u2.mongodb.net/ecommerce?retryWrites=true&w=majority



exports.configObject={
    PORT:process.env.PORT||8080,
    Database_mongo_Url:process.env.Database_mongo_Url,
    Cookie_word_secret:process.env.Cookie_word_secret,
    Jwt_private_key:process.env.Jwt_private_key,
    Github_client_Id:process.env.Github_client_Id,
    Github_client_Secret:process.env.Github_client_Secret,
    Github_callback_Url:process.env.Github_callback_Url,
    Cookie_auth:process.env.Cookie_auth,
    Admin_user_email:process.env.Admin_user_email,
    Admin_user_password:process.env.Admin_user_password,
}

exports.connectDb = async () => {
    try{
        MongoSingleton.getInstance(process.env.Database_mongo_Url)
        console.log('Base de datos conectada')
    }catch (err) {
        console.log(err)
    }
}


exports.sessionsMdb = (app) => {
    app.use(
        session({
            // store: MongoStore.create({
            //     mongoUrl: this.configObject.Database_mongo_Url,
            //     ttl: 3000,
            // }),
            secret: process.env.Cookie_word_secret,
            resave: true,
            saveUninitialized: true,
        })
    );
};