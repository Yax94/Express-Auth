import Joi from "@hapi/joi"

const SignUpSchema = Joi.object({
    username: Joi.string()
                .alphanum()
                .min(3)
                .max(20)
                .required()
                .error(() =>{
                    return new Error('please provide a username between 3 and 20 caracters')
                }),
    password: Joi.string()
                .pattern(new RegExp('^[a-zA-Z0-9$@$#!%*?&-]{6,}$'))
                .required()
                .error((errors) =>{
                    errors.forEach(err =>{
                        switch(err.type){
                            case "any.empty":
                                err.message = "please provide a password"
                                break;
                            case "string.pattern":
                                err.message = "the password should contains at least 6 caracters"
                                break;
                            default:
                                break;
                        }
                    })
                    return errors;
                }),
    email: Joi.string()
            .required()
            .lowercase()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } })
            .error(() =>{
                return new Error('please provide a valid mail address')
            })

})

const SignInSchema = Joi.object({
    email: Joi.string()
            .required()
            .lowercase()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } })
            .error(() =>{
                return new Error('please provide a valid mail address')
            }),
    password: Joi.string()
                .required()
                .error(() =>{
                    return new Error('please provide a password')
                })

})


export default Object.freeze({
    SignUpSchema,
    SignInSchema
})