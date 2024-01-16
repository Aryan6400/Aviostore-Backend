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

export {saveForLater};