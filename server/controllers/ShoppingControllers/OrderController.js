const paypal = require('../../helpers/paypal')
const Order = require('../../models/Order')
const Cart=require('../../models/Cart')
const Product=require('../../models/Product')
const dotenv=require('dotenv')
dotenv.config()
const createOrder = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the incoming request body

        const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body;

        // Validate required fields
        if (!userId || !cartItems || !totalAmount) {
            console.log("Validation failed: Missing required fields");
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        console.log("Creating PayPal payment...");

        const create_payment_json = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            redirect_urls: {
                return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
            },
            transactions: [
                {
                    item_list: {
                        items: cartItems.map(item => ({
                            name: item.title,
                            sku: item.productId,
                            price: item.price.toFixed(2),
                            currency: 'USD',
                            quantity: item.quantity
                        }))
                    },
                    amount: {
                        currency: 'USD',
                        total: totalAmount.toFixed(2)
                    },
                    description: 'description'
                }
            ]
        };

        console.log("PayPal Payment JSON:", create_payment_json);
        console.log("Return URL:", `${process.env.CLIENT_BASE_URL}/shop/paypal-return`);
        console.log("Cancel URL:", `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`);

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
            if (error) {
                console.log("PayPal Error:", error.response || error); // Log the full PayPal error
                return res.status(500).json({
                    success: false,
                    message: 'Error while creating PayPal payment',
                    error: error.response || error.message
                });
            } else {
                console.log("PayPal Payment Info:", paymentInfo); // Log the PayPal payment info

                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                });

                await newlyCreatedOrder.save();

                const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;

                res.status(201).json({
                    success: true,
                    approvalURL,
                    orderId: newlyCreatedOrder._id
                });
            }
        });
    } catch (error) {
        console.log("Server Error:", error); // Log the server error
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message
        });
    }
};


const capturePayment = async (req, res) => {
    try {
      const {paymentId , payerId ,orderId}=req.body

      let order = await Order.findById(orderId)

      if(!order){
        return res.status(404).json({
            success:false,
            message:'Order can not be found'
        })
      }
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed'
      order.paymentId = paymentId;
      order.payerId =payerId;

      for(let item of order.cartItems){
        let product = await Product.findById(item.productId)

        if(!product){
            return res.status(404).json({
                success:false,
                message:`Not enough stock for this product ${product.title}`
            })
        }
        product.totalStock -=item.quantity

        await product.save()
      }

      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId)

      await order.save()

        res.status(200).json({
            success:true , 
            message:'Order Confirmed',
            data : order
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Ocurred'
        })
    }
}

const getAllOrdersByUser = async(req,res)=>{
    try { 
         const {userId} =req.params;

         const orders = await Order.find({userId})


         if(!orders.length){
            return res.status(404).json({
                success : false , 
                message :'No orders found!'
            })
         }

         res.status(200).json({
            success:true , 
            data : orders
         })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Ocurred'
        })
    }
}
const getOrderDetails = async(req,res)=>{
    try {
        const {id} =req.params;

        const order = await Order.findById(id)


        if(!order){
           return res.status(404).json({
               success : false , 
               message :'Order not found!'
           })
        }
       
        res.status(200).json({
            success:true , 
            data : order
         })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Some Error Ocurred'
        })
    }
}
module.exports = { createOrder, capturePayment ,getAllOrdersByUser ,getOrderDetails}