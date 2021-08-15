const express=require('express')
const productModel=require('../models/product.model')
const cartModel=require('../models/cart.model')
const router=express.Router()
router.get('/',async(req,res)=>{
    try{
        //req.session.cart=null
        let cart=[] 
        let total=0
        if(req.session.cart){
            cart=req.session.cart.items
            total=req.session.cart.priceTotal
        }
        res.render('carts/cart',{cart:cart, total:total})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add/:id',async(req,res)=>{
    try{
        const product=await productModel.findById(req.params.id)
        const cart=new cartModel(req.session.cart ? req.session.cart: {items:[]})
        cart.add(product,req.params.id, product.imageSrc)
        req.session.cart=cart
        res.redirect('/cart')
    }catch(e){
        console.log(e.message)
        res.redirect('/')
    }
    
})
router.post('/:id',async(req,res)=>{
    try{
        const id=req.params.id
        const cart=new cartModel(req.session.cart)
        cart.delete(id)
        req.session.cart=cart
        // req.send("Add Successfully")
        res.redirect('/cart')
    }catch(e){
        console.log(e.message)
        res.redirect('/')
    }
    
})


router.get('/reduce/:id',(res,req) => {
    try{
        const id=req.params.id
        const cart =new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart=cart
        res.redirect('/cart')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/increase/:id',(res,req) => {
    try{
        const id= req.params.id
        const cart =new cartModel(req.session.cart)
        cart.reduce(id)
        req.session.cart=cart
        res.redirect('/cart')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})


module.exports=router