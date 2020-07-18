import middlewares from '../middlewares/middlewares-index.js';





export default (name, app, router) => {

    /**
     * This routes are only accessible for logged in users
     */
    router.use(middlewares.isAuth)

    router.get("/me", (req, res) => {
        res.json(req.user).status(200)
    })
    
    app.use(name, router);


};