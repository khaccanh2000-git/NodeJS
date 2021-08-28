const express=require('express')
const categoryModel=require('../models/category.model')
const productModel=require('../models/product.model')
const userModel=require('../models/user.model')
const router=express.Router()

function check(req,res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/user/login')
}

router.get('/',async(req,res)=>{
    try{
        const products=await productModel.find().populate('category',['name'])
        res.render('products/list',{products:products})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/add',check,async(req,res)=>{
    const product=new productModel()
    const categories=await categoryModel.find()
    res.render('products/add',{product:product,categories:categories})
})
router.post('/',async(req,res)=>{
 
    try{
        const productNew=new productModel({
            name:req.body.name,
            info:req.body.info,
            quantity:req.body.quantity,
            price:req.body.price,
            category:req.body.category,
        })
        if(req.body.image != null && req.body.image !==''){
        const imageEncode = JSON.parse(req.body.image)
        productNew.imageType=imageEncode.type
        productNew.imageData=new Buffer.from(imageEncode.data,'base64')
        }
        await productNew.save()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.get('/edit/:id',check,async(req,res)=>{
    try{
        const categories=await categoryModel.find()
        const product=await productModel.findById(req.params.id)
        res.render('products/edit',{product:product,categories:categories})
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
    
})
router.put('/edit/:id',async(req,res)=>{
    try{
        const pro=await productModel.findById(req.params.id)
        pro.name=req.body.name
        pro.info= req.body.info
        pro.price= req.body.price
        pro.quantity=req.body.quantity
        pro.category=req.body.category
        await pro.save()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})
router.post('/delete/:id',check,async(req,res)=>{
    try{
        const productDelete=await productModel.findById(req.params.id)
        await productDelete.remove()
        res.redirect('/product')
    }catch(e){
        console.log(e)
        res.redirect('/')
    }
})

router.get('/search', async(req, res) => {
    const search_name=req.query.name
    const search_price =req.query.price
    const products= await productModel.find().populate('category',['name'])
    
    const result = products.filter((product) => {
        return product.category.name.toLowerCase().indexOf(search_name.toLowerCase()) !==-1 || product.price === parseInt(search_price)
    })
    res.render('products/search',{products:result})
})
module.exports=router