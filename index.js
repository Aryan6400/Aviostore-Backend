import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
const port = process.env.PORT || 8080;

import { addProduct, addToCart, buyProduct, getAllProducts, getCartItems, getProductDetail, isInCart, removeFromCart } from "./controllers/product.js";
import { register, login } from "./controllers/auth.js";
import auth from "./middlewares/auth.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.then(() => {
    console.log('Connected to MongoDB');
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});

app.get('/all-products', getAllProducts);
app.post('/add-product', auth, addProduct);
app.get('/product/:productId', getProductDetail);
app.get('/get-cart', auth, getCartItems);
app.patch('/add-to-cart', auth, addToCart);
app.patch('/remove-from-cart', auth, removeFromCart);
app.get("/is-in-cart/:productId", auth, isInCart);
app.post("/buy-products", auth, buyProduct);
app.post('/login', login);
app.post('/register', register);

const server = app.listen(port, ()=>{
    console.log('Server started on port 8080');
});