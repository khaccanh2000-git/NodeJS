const localStrategy=require('passport-local').Strategy
const githubStrategy=require('passport-github').Strategy
const userModel=require('./user.model')
const bcrypt= require('bcrypt')
const passport= require('passport')

module.exports=function(passsport){
    passport.serializeUser(function(user,done){
        done(null,user.id)
    })
    passport.deserializeUser(async(id,done)=>{
        try{
            const user=await userModel.findById(id)
            return done(null,user) 
        }
        catch(e){
            done(e)
        }
    })
    passport.use(new localStrategy(
        { 
            usernameField:'email',
            passwordField:'password'

        },
        async function(email,password,done){
            const user = await userModel.findOne({'email':email})
            console.log(user)
            if(!user){
                return done(null,false,{message: " No user with that email"})
            }
            try{
                if(await bcrypt.compare(password,user.password)){
                    console.log("Login successfully")
                    return done(null,user, {message:"Login successfully"})
                }
                return done(null,false,{message:"Password incorrect"})
            }
        catch(e){
            done(e)
        }
        }
    ))
    // passport.use(new githubStrategy(
    //     { 
    //         clientID:'f12270b3b5b5ff322c14',
    //         cllientSecret:'06b6390a8ee3b6ff985f9b79ab9a0ee8e7dba429  ',
    //         callbackURL:'http://localhost:3000/user/github/callback'

    //     },
    //     async function(accessToken,refreshToken,profile,done){
    //         console.log(profile)
    //     }
    // ))
}