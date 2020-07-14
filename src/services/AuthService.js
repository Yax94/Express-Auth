import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import config from '../config/config.js'


export default class AuthService{
    constructor(userModel){
        this.userModel = userModel
    }

    async SignUp(userInput){
        try {
            const salt = await bcrypt.genSalt(10) 
            const hashPassword = await bcrypt.hash(userInput.password, salt)
            
            const userRecord = await this.userModel.create({
                ...userInput,
                salt : salt.toString(),
                password : hashPassword
            })
            
       
            if (!userRecord) { throw new Error('User cannot be created') }

            return this.returnUser(userRecord)

        } catch (error) {
            throw(error)
        }
        
    }

    async SignIn(userInfo){
        try{
            const userRecord = await this.userModel.findOne({email : userInfo.email})
            const verified = await bcrypt.compare(userInfo.password, userRecord.password)

            if(!verified) { throw new Error('The password is not correct') }

            return this.returnUser(userRecord)

        }catch(error){
            throw(error)
        }
    }

    generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        return jwt.sign(
            {
            _id: user._id, // We are gonna use this in the middleware 'isAuth'
            role: user.role,
            name: user.name,
            exp: exp.getTime() / 1000,
            },
            config.jwtSecret,
        );
    }

    returnUser(userRecord){
        const token = this.generateToken(userRecord);
        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token };
    }
}