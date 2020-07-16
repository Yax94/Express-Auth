import chai from "chai";
import chaiHttp from "chai-http";
const { assert } = chai;

chai.use(chaiHttp)


import AuthService from "../src/services/AuthService.js"
import User from "../src/models/User.js"
import mongoLoader from "../src/loaders/mongoose.js"
import expressLoader from "../src/loaders/express.js"

import express from "express";

// begin a test suite of one or more tests
describe('AuthentificationService', function() {

    
    
    const authService = new AuthService(User)
    
    

    // add a test hook
    before(async function() {
        this.app = express()
        this.db = await mongoLoader()
        expressLoader(this.app)

        
        
        this.testUser = {
            email : "bcdegffrre@tffdfestfff.fr",
            password : "pafdfss",
            name : "name"
        }

    
        return authService.SignUp(this.testUser).then((user) => {
            this.user = user
        }).catch((err) => {console.log(err);})
        
        

    })

    after(function(done){
        User.collection.drop((err, result) => {
            this.db.disconnect()
            done()
        })
        
    })


    context('SignUp User', function() {  
         
        it('Contains user property', function() {
            assert.property(this.user, "user")
        })
        it('Contains valid token property', function(done) {
            assert.property(this.user, "token",  "token is in the object")
            authService.validateToken(this.user.token, function(err, decoded){
                assert.isDefined(decoded)
                assert.isNull(err)
                done()
            })
        })
    })

    context('SignIn User', function() {     
        
        
        it('Can sign in valid user', async function() {
            const {email, password} = this.testUser
            return authService.SignIn({email, password}).then((returnedUser) => {
                assert.isDefined(returnedUser, "the user signed in is defined")
                assert.property(returnedUser, "token", "the user contains the token")
                assert.notEqual(returnedUser.token, this.user.token, "token is changed after sign in")
                this.signedUserToken = returnedUser.token
            })
        })

        it('Token returned by signed in user is valid', function(done){
            authService.validateToken(this.signedUserToken, function(err, decoded){
                assert.isDefined(decoded)
                assert.isNull(err)
                done()
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
        

        it('Can acces middleware with valid token', function(){
            chai.request(this.app)
              .get('/api/user/me')
              .set('Authorization', "Token " + this.user.token)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.equal(res.status, 200, "status equal to 401")  
            })
        })

        it("Can't acces middleware with unvalid token", function(){
            chai.request(this.app)
              .get('/api/user/me')
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.equal(res.status, 401, "status equal to 401")
                assert.property(res.body, "error", "Path contains error message")
            })
        })
    })

})

  