import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: String,
    price: String,
    originalPrice: String,
    shortDescription: String,
    offer: [String],
    img_url: [String],
    rate: Number,
    ratings: Number,
    reviews: Number,
    status: String,
    deliveryCharges: Number,
    seller: String,
    cod: String,
    return: String,
    replacement: String,
    primaryCategory: String,
    secondaryCategory: String,
    buyers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    userReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
    }]
}, {timestamps:true})


const Product = mongoose.model("Product", productSchema);

export { Product };