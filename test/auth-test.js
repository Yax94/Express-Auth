import chai from "chai";
const { assert } = chai;


import AuthService from "../src/services/AuthService.js"
import User from "../src/models/User.js"
import mongoLoader from "../src/loaders/mongoose.js"

// begin a test suite of one or more tests
describe('AuthentificationService', function() {

    
    
    const authService = new AuthService(User)
    

    // add a test hook
    before(async function() {
        
        this.db = await mongoLoader()

        await User.collection.drop().catch((err) => {console.log("error in drop", err);})
        
        this.testUser = {
            email : "bcdegffrre@tffdfestfff.fr",
            password : "pafdfss",
            name : "name"
        }

    
        return authService.SignUp(this.testUser).then((user) => {
            this.user = user
        }).catch((err) => {console.log(err);})
        
        

    })

    after(function(){
        this.db.disconnect()
    })


    context('SignUp User returned', function() {  
        
        console.log("Signup context called");
         
        it('Contains user property', function() {
            assert.property(this.user, "user")
        })
        it('Contains token property', function() {
            assert.property(this.user, "token")
        })
    })

    context('SignIn User', function() {     
        
        
        
        

        it('Can sign in valid user', async function() {
            const {email, password} = this.testUser
            return authService.SignIn({email, password}).then((returnedUser) => {
                assert.isDefined(returnedUser, "the user signed in is defined")
                assert.property(returnedUser, "token", "the user contains the token")
                assert.notEqual(returnedUser.token, this.user.token, "token is changed after sign in")
            })
        })
        it('Can\'t sign in unvalid user', async function() {
            const {email, password} = this.testUser
            return authService.SignIn({email, password : (password + " ")}).then((returnedUser) => {
                assert.isUndefined(returnedUser, "the user signed in is undefined")
            }).catch((err) => {
                assert.isDefined(err, "An error is defined")
                assert.include(err.message, 'password', "the error includes the password word")
            })
        })
    })
    
    context('Token can be verified', function(){
        it('Token returned by user is valid', function(){
            assert.fail("token assert")
        })
    })

})

  