const express=require('express')
const userModel = require('../models/user.model')
const bcrypt = require('bcrypt')
const passport=require('passport')
const router=express.Router()

router.get('/', async(req, res)=>{
    const users=await userModel.find()
    res.render('users/index',{users:users})
})
router.get('/register',(req,res)=>{
    res.render("users/register")
})
// function check(req,res, next){
//     if(req.isAuthenticated()){
//         return next()
//     }
//     res.redirect('/user/login')
// }
router.get('/profile',(req,res)=>{
    let value="No name"
    if(req.user){
        value="name: "+req.user.name
    }
    console.log(value)
    res.render('users/profile',{value:value})
})
// LOGIN
router.get('/login',(req,res)=>{
    res.render("users/login")
})
router.post('/login',passport.authenticate('local',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/login',
    failureFlash: true
}))
router.post('/',async(req,res)=>{
    try{
        const hashedPassword=await bcrypt.hash(req.body.password,10)
        const users=new userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        await users.save()
        req.flash("success","Insert succesfull")
        res.redirect('/user')
    }
    catch(e){
        req.flash("error","Insert failed")
        console.log(e)
        res.redirect('/')
    }
})

router.get('/logout',(req, res) => {
    req.logout()
    res.redirect('/user/login')
})

router.delete('/:id', async(req,res)=>{
    try{
        const user =await userModel.findByIdAndDelete(req.params.id)
        res.redirect('/user')
    }
    catch(e){
        console.log(e)
        res.redirect('/')
    }
})

// router.get('/github',passport.authenticate('github'))
// router.get('/github/callback',passport.authenticate('github',{
//     successRedirect:'/user/profile',
//     failureRedirect:'/user/login',
//     failureFlash:true
// }))
module.exports = router