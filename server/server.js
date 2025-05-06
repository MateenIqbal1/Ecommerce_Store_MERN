
const dotenv=require('dotenv')
dotenv.config()
const express=require('express')
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cors=require('cors')
const authRouter=require('./routes/auth/auth-routes')
const app=express()
const adminProductsRouter = require('./routes/admin/product-routes')
const shopProductsRouter=require('./routes/shop/productShopRoutes')
const shopCartRouter=require('./routes/shop/cartRoutes')
const shopAddressRouter=require('./routes/shop/addressRoute')
const shopOrderRouter=require('./routes/shop/orderRoutes')
const shopSearchRouter=require('./routes/shop/searchRoutes')
const shopReviewRouter=require('./routes/shop/reviewRoutes')
const adminOrderRouter=require('./routes/admin/orderRoutes')
const commonFeatureRouter = require('./routes/Common-Routes/FeatureRoutes')




app.use(cookieParser());
app.use(express.json());
//create a database connection 
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Mongodb connected'))
    .catch(error => console.log(error));
    app.use(cors({
        origin: 'https://ecomerce-frontend-seven.vercel.app', // Allow only this origin
        credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    }));


const PORT=process.env.PORT;

app.use('/api/auth',authRouter)
app.use('/api/admin/products',adminProductsRouter)
app.use('/api/admin/orders',adminOrderRouter)
app.use('/api/shop/products',shopProductsRouter)
app.use('/api/shop/cart',shopCartRouter)
app.use('/api/shop/address',shopAddressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use('/api/shop/review', shopReviewRouter)
app.use('/api/common/feature', commonFeatureRouter)



app.get("/", (req, res) => {
    res.send("Hello from Vercel and server.js!");
});

app.listen(PORT,()=>console.log(`server is now running on the PORT ${PORT}`))
