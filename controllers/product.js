import {Product} from "../models/product.js";
import { User } from "../models/user.js";

const addProduct = async(req,res)=> {
    const {
        title,
        price,
        originalPrice,
        shortDescription,
        offer,
        img_url,
        rate,
        ratings,
        reviews,
        status,
        deliveryCharges,
        seller,
    } = req.body;
    try{
        const newProduct = await Product.create({
            title,
            price,
            originalPrice,
            shortDescription,
            offer,
            img_url,
            rate,
            ratings,
            reviews,
            status,
            deliveryCharges,
            seller,
        });
        res.status(201).json(newProduct);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getAllProducts = async(req,res)=> {
    try{
        const products = await Product.find();
        res.status(201).json(products);
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

const addToCart = async(req,res) => {
    try{
        const newUser = await User.findByIdAndUpdate(req.userId,{$push: {cart: req.body.productId}}, {new:true}).populate("cart");
        const items = newUser.cart;
        res.status(201).json(items);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const removeFromCart = async(req,res) => {
    try{
        const user = await User.findById(req.userId);
        const index = user.cart.indexOf(req.body.productId);
        user.cart.splice(index,1);
        await user.save();
        const newUser = await User.findById(req.userId).populate("cart");
        const items = newUser.cart;
        res.status(201).json(items);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getCartItems = async(req,res) => {
    try{
        const user = await User.findById(req.userId).populate("cart");
        const items = user.cart;
        res.status(201).json(items);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const isInCart = async(req,res) => {
    try{
        const productId = req.params.productId;
        const user = await User.find({_id:req.userId, cart: { $in: [ productId ] }});
        if(user.length!==0){
            res.status(201).json({flag:true});
        }
        else{
            res.status(201).json({flag:false});
        }
    } catch(error){
        res.status(401).json({error:error});
    }
}

const buyProduct = async(req,res) => {
    const products = req.body.products;
    try{
        const user = await User.findByIdAndUpdate(req.userId, {$push: {pastOrders:{$each : products}}}, {new:true}).populate("cart").populate("pastOrders");
        res.status(201).json(user);
    } catch(err){
        res.status(401).json({error:err});
    }
}

export {addProduct, getAllProducts, getProductDetail, addToCart, removeFromCart, getCartItems, isInCart, buyProduct};