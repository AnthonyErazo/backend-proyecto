const dotenv=require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const MongoSingleton = require('../utils/mongoSingleton')

dotenv.config()

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
    Gmail_user_app:process.env.Gmail_user_app,
    Gmail_pass_app:process.env.Gmail_pass_app
}

exports.connectDb = async () => {
    try{
        MongoSingleton.getInstance(process.env.Database_mongo_Url)
        console.log('Base de datos conectada')
    }catch (err) {
        console.log(err)
    }
}

