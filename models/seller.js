import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    mob: String,
    address: String,
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    rate: Number,
}, {timestamps:true})


const Seller = mongoose.model("Seller", sellerSchema);

export { Seller };