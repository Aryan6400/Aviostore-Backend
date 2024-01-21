import { Order } from "../models/order.js";
import { User } from "../models/user.js";

const saveForLater = async(req,res) => {
    try{
        const order = await Order.findOne({placed: 1, user: req.userId, product: req.body.productId});
        const user = await User.findById(req.userId);
        const index = user.cart.indexOf(order._id);
        user.cart.splice(index,1);
        const savedOrder = await Order.findOne({placed: 0, user: req.userId, product: req.body.productId});
        
        if(savedOrder){
            await user.save();
            await Order.findByIdAndDelete(order._id);
            const newUser = await User.findById(req.userId).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
        else{
            user.saved.push(order);
            await user.save();
            order.placed=0;
            await order.save();
            const newUser = await User.findById(req.userId).populate("cart");
            const items = await User.populate(newUser, {path: 'cart.product'});
            res.status(201).json(items.cart);
        }
    } catch(err){
        res.status(401).json({error:err});
    }
}

const getSaved = async(req,res) => {
    try {
        const user = await User.findById(req.userId).populate("saved");
        const items = await User.populate(user, {path: 'saved.product'});
        res.status(201).json(items.saved);
    } catch (err) {
        res.status(401).json({error:err});
    }
}

const removeFromSaved = async(req,res) => {
    try {
        const order = await Order.findOne({placed: 0, user: req.userId, product: req.body.productId});
        const user = await User.findById(req.userId);
        const index = user.saved.indexOf(order._id);
        user.saved.splice(index,1);
        await Order.findByIdAndDelete(order._id);
        await user.save();
        const newUser = await User.findById(req.userId).populate("saved");
        const items = await User.populate(newUser, {path: 'saved.product'});
        res.status(201).json(items.saved);
    } catch (err) {
        res.status(401).json({error:err});
    }
}

const moveToCart = async(req,res) => {
    try {
        const order = await Order.findOne({placed: 0, user: req.userId, product: req.body.productId});
        const user = await User.findById(req.userId);
        const index = user.saved.indexOf(order._id);
        user.saved.splice(index,1);
        const cartOrder = await Order.findOne({placed: 1, user: req.userId, product: req.body.productId});
        if(cartOrder){
            await Order.findByIdAndDelete(order._id);
            await user.save();
            const newUser = await User.findById(req.userId).populate("saved");
            const items = await User.populate(newUser, {path: 'saved.product'});
            res.status(201).json(items.saved);
        }
        else{
            user.cart.push(order);
            await user.save();
            order.placed=1;
            await order.save();
            const newUser = await User.findById(req.userId).populate("saved");
            const items = await User.populate(newUser, {path: 'saved.product'});
            res.status(201).json(items.saved);
        }
    } catch (err) {
        console.log(err);
        res.status(401).json({error:err});
    }
}

export {saveForLater, getSaved, removeFromSaved, moveToCart};