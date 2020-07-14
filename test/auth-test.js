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
        // ...some logic before each test is run
        this.db = await mongoLoader()

        await User.collection.drop().catch((err) => {console.log("error in drop", err);})
        
        const testUser = {
            email : "bcdegffrre@tffdfestfff.fr",
            password : "pafdfss",
            name : "name"
        }


        return authService.SignUp(testUser).then((user) => {
            this.user = user
        }).catch((err) => {console.log(err);})
        
        

    })
    after(function(){
        this.db.disconnect()
    })



    context('SignUp User returned', function() {       
         


        it('Contains user property', function() {
            assert.property(this.user, "user")
        })
        it('Contains token property', function() {
            assert.property(this.user, "token")
        })
    })
    // ...some more tests

})

  