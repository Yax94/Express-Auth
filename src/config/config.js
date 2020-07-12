import dotenv from "dotenv"

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if(dotenv.config().error){
    throw new Error("⚠️ Couldn't find env file ⚠️")
}

export default {
    /**
    * PORTS
    **/
    port : parseInt(process.env.PORT, 10) || 3000,

    /**
    * Database information (mongodb = url)
    **/
    databaseURL : process.env.MONGODB_URI,

    /**
    * JWT token secret key
    **/
    jwtSecret: process.env.JWT_SECRET,

    /**
    * JWT alhorithm used
    **/
    jwtAlgorthm: process.env.JWT_ALGORITHM || ['HS256'],

    /**
    * API configs
    **/
    api: {
        prefix: '/api',
    }

}