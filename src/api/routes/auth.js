import User from "../../models/User.js"
import AuthService from "../../services/AuthService.js"


const authService = new AuthService(User)

export default (name, app, router) => {

    router.post("/signup", async (req, res, next) => {
   
        const userInput = req.body
     
        try {
            const {user , token} = await authService.SignUp(userInput)
            return res.status(201).json({user, token})
        } catch (error) {
            return next(error)
        }
    
    })

    router.post("/signin", async (req, res, next) => {

        const userInfo = req.body

        try {
            const {user , token} = await authService.SignIn(userInfo)
            return res.status(201).json({user, token})
        } catch (error) {
            return next(error)
        }

    })

    //app is the main router
    app.use(name, router);


    
};