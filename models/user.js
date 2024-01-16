import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    mob: String,
    address: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    saved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    favourites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    }],
    pastOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }]
}, {timestamps:true})


const User = mongoose.model("User", userSchema);

export { User };