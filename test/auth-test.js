import chai from "chai";
import chaiHttp from "chai-http";
const { assert } = chai;

chai.use(chaiHttp)


import AuthService from "../src/services/AuthService.js"
import User from "../src/models/User.js"
import AuthDataValidation from "../src/models/AuthDataValidation.js"
import mongoLoader from "../src/loaders/mongoose.js"
import expressLoader from "../src/loaders/express.js"

import express from "express";
import user from "../src/api/routes/user.js";

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
            username : "name"
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
    
    context('Token verification', function(){
        

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

    context('Data validation', function(){

        it("Prevent from duplicate mail address", function(done){
            var {email, username, password} = this.testUser
            username = (username + "b")
            chai.request(this.app)
              .post("/api/auth/signup")
              .send({email, username, password})
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "mail", "Error message contains mail keyword")
                done()
              })  
        })

        it("Prevent from duplicate username", function(done){
            var {email, username, password} = this.testUser
            email = ("b" + email)
            chai.request(this.app)
              .post("/api/auth/signup")
              .send({email, username, password})
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "username", "Error message contains username keyword")
                done()
              })  
        })

        it("User should contain email property on SignUp", function(done){

            const user = {password: "aaaaaa", username: "aaa"}

            chai.request(this.app)
              .post('/api/auth/signup')
              .send(user)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "mail", "Error message contains mail keyword")
                done()
            })
        })

        it("User should contain username property on SignUp", function(done){

            const user = {password: "aaaaaa", email: "aaa@aaa.com"}

            chai.request(this.app)
              .post('/api/auth/signup')
              .send(user)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "username", "Error message contains username keyword")
                done()
            })
        })

        it("User should contain password property on SignUp", function(done){

            const user = {username: "aaaaaa", email: "aaa@aaa.com"}

            chai.request(this.app)
              .post('/api/auth/signup')
              .send(user)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "password", "Error message contains password keyword")
                done()
            })
        })

        it("User should contains email property on SignIn", function(done){

            const user = {password: "aaaaaa"}

            chai.request(this.app)
              .post('/api/auth/signin')
              .send(user)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "mail", "Error message contains mail keyword")
                done()
            })
        })

        it("User should contains password property on SignIn", function(done){

            const user = {email: "aaa@aaa.com"}

            chai.request(this.app)
              .post('/api/auth/signin')
              .send(user)
              .end(function(err, res){
                assert.isNull(err, "error is null")
                assert.notEqual(res.status, 200, "status different from 200")
                assert.notEqual(res.status, 404, "status different from 404 Not Found")
                assert.property(res.body, "errors", "Path contains error message")
                assert.include(res.body.errors.message, "password", "Error message contains password keyword")
                done()
            })
        })

        it("Password should respect format", async function() {
            const username = "aaaaa"
            const email = "aaa@aaa.com"

            var password = "eeeee"
            var error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isDefined(error, "password should have at least 6 caracters")

            var password = "eeeeee"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isUndefined(error, "password should have at least 6 caracters")
        })

        it("Email should respect format", async function() {
            const username = "aaaaa"
            const password = "aaaaaaa"
            
            var email = "eeeee"
            var error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isDefined(error, "email should contain @")

            email = "ee@eee"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isDefined(error, "email should contain .domain")

            email = "ee@eee.fr"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isUndefined(error, ".fr domain accepted")

            email = "ee@eee.com"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isUndefined(error, ".com domain accepted")

            email = "ee@eee.net"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isUndefined(error, ".net domain accepted")

            email = "ee@eee.de"
            error = AuthDataValidation.SignUpSchema.validate({username, email, password}).error
            assert.isDefined(error, "other domains not accepted")
        })
    })

})

  