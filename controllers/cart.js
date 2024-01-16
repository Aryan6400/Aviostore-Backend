import { Order } from "../models/order.js";
import { User } from "../models/user.js";

const addToCart = async(req,res) => {
    try{
        const order = await Order.findOne({placed:1, user: req.userId, product: req.body.productId});
        if(order){
            order.quantity=Number(order.quantity)+Number(req.body.quantity);
            await order.save();
            const newUser = await User.findById(req.userId).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
        else{
            const newOrder = new Order({
                user: req.userId,
                product: req.body.productId,
                quantity: req.body.quantity,
                placed: 1
            });
            const savedOrder = await newOrder.save();
            const newUser = await User.findByIdAndUpdate(req.userId,{$push: {cart: savedOrder}}, {new:true}).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
    } catch(err){
        res.status(401).json({error:err});
    }
}

const removeFromCart = async(req,res) => {
    try{
        const user = await User.findById(req.userId);
        const order = await Order.findOne({placed:1, user: req.userId, product: req.body.productId});
        if(Number(order.quantity)>Number(req.body.quantity)){
            order.quantity=Number(order.quantity)-Number(req.body.quantity);
            await order.save();
            const newUser = await User.findById(req.userId).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
        else{
            const index = user.cart.indexOf(order._id);
            user.cart.splice(index,1);
            await user.save();
            await Order.findByIdAndDelete(order._id);
            const newUser = await User.findById(req.userId).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
    } catch(err){
        res.status(401).json({error:err});
    }
}

const removeAllFromCart = async(req,res) => {
    try{
        const user = await User.findById(req.userId);
        const order = await Order.findOne({placed:1, user: req.userId, product: req.body.productId});
        const index = user.cart.indexOf(order._id);
        user.cart.splice(index,1);
        await user.save();
        await Order.findByIdAndDelete(order._id);
        const newUser = await User.findById(req.userId).populate("cart");
        const items = await User.populate(newUser, {path: 'cart.product'});
        res.status(201).json(items.cart);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getCartItems = async(req,res) => {
    try{
        const user = await User.findById(req.userId).populate("cart");
        const items = await User.populate(user, {path: 'cart.product'});
        res.status(201).json(items.cart);
    } catch(err){
        res.status(401).json({error:err});
    }
}

const isInCart = async(req,res) => {
    try{
        const productId = req.params.productId;
        const order = await Order.findOne({placed:1, user: req.userId, product: productId});
        if(order){
            res.status(201).json({flag:true});
        }
        else{
            res.status(201).json({flag:false});
        }
    } catch(error){
        res.status(401).json({error:error});
    }
}

export {addToCart, removeFromCart, removeAllFromCart, getCartItems, isInCart};