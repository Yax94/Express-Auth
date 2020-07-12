//import express from 'express';
import middlewares from '../middlewares/middlewares-index.js';
//const route = express.Router();





export default (name, app, router) => {
    //app is the main router

    /**
     * This routes are only accessible for logged in users
     */
    router.use(middlewares.isAuth)

    router.get("/me", (req, res) => {
        res.json({ok : "ok"}).status(200)
    })
    
    app.use(name, router);


};