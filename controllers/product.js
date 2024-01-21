import { Order } from "../models/order.js";
import {Product} from "../models/product.js";
import { User } from "../models/user.js";

const addProduct = async(req,res)=> {
    try{
        const result = await Product.insertMany(req.body.products);
        res.status(201).json(result);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getAllProducts = async(req,res)=> {
    const primaryCategory = req.query.primaryCategory;
    const secondaryCategory = req.query.secondaryCategory;
    try{
        if(primaryCategory==="None"){
            const products = await Product.find();
            res.status(201).json(products);
        }
        else{
            const products = await Product.find({primaryCategory:primaryCategory, secondaryCategory:secondaryCategory});
            res.status(201).json(products);
        }
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getProductDetail = async(req,res)=> {
    try{
        const productId = req.params.productId;
        const foundProduct = await Product.findById(productId).populate("buyers", "name");
        res.status(201).json(foundProduct);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const buyProduct = async(req,res) => {
    try{
        const user = await User.findById(req.userId);
        await Order.updateMany({user: req.userId, placed:1},{placed:2});
        const orders = await Order.find({user: req.userId, placed:2});
        user.cart=[];
        orders.map(async(item)=>{
            user.pastOrders.push(item._id);
        });
        await user.save();
        const newUser = await User.findById(req.userId).populate("cart");
        const items = await User.populate(newUser, {path: 'cart.product'});
        res.status(201).json(items.cart);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const addToFav = async(req,res) => {
    try{
        const user = await User.findByIdAndUpdate(req.userId, {$push: {favourites:req.body.productId}}, {new:true}).populate("cart").populate("pastOrders");
        res.status(201).json(user);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getFavs = async(req,res) => {
    try {
        const user = await User.findById(req.userId).populate("favourites");
        res.status(201).json(user.favourites);
    } catch (err) {
        res.status(401).json({error:err});
    }
}

export {addProduct, getAllProducts, getProductDetail, buyProduct, addToFav, getFavs};