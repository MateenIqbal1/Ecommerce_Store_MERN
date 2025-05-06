import React, { useState } from 'react'
import img from '../../assets/account.jpg'
import Address from '@/components/shopping-view/Address'
import { useDispatch, useSelector } from 'react-redux'
import UserCartItemsContent from '@/components/shopping-view/cart-items-content'
import { Button } from '@/components/ui/button'
import { createNewOrder } from '@/store/shop/order-slice'
import { useToast } from '@/hooks/use-toast'
const ShoppingCheckout = () => {
  const { cartItems } = useSelector(state => state.shopCart)
  const { user } = useSelector((state) => state.auth)
  const { approvalURL } = useSelector((state) => state.shopOrder)
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null)
  const [isPaymentStart, setIsPaymentStart] = useState(false)
  const dispatch = useDispatch()
  const {toast} =useToast()
  //console.log('this is current selected address ',currentSelectedAddress);

  const totalCartAmount = cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items.reduce((sum, currentItem) => sum + (
    currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price) * currentItem?.quantity, 0) : 0

  function handleInitiatePaypalPayment() {
    
    if(cartItems.length === 0){
      toast({
        title: 'your cart is empty .Please add some items to proceed',
        className: 'bg-red-500 text-white font-bold p-4 rounded',
      })
      return 
    }

    if(currentSelectedAddress === null){
      toast({
        title: 'Please select one address to Proceed',
        className: 'bg-red-500 text-white font-bold p-4 rounded',
      })
      return 
    }

    const orderDate = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map(singleCartItem => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price: singleCartItem?.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price,
        quantity: singleCartItem?.quantity
      })), addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: ''
    }

    dispatch(createNewOrder(orderDate)).then((data) => {
      console.log(data, 'this is data in new testing');
      if (data?.payload?.success) {
        setIsPaymentStart(true)
      } else {
        setIsPaymentStart(false)
      }
    })
  }

  if (approvalURL) {
    window.location.href = approvalURL
  }

  return (
    <div className='flex flex-col'>
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className='h-full w-full object-cover object-center' />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5 gap-5">
        <Address selectedId={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} />
        <div className="flex flex-col gap-4">
          {
            cartItems && cartItems.items && cartItems.items.length > 0 ?
              cartItems.items.map(item => <UserCartItemsContent cartItem={item} />) : null
          }
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className='font-bold'>Total</span>
              <span className='font-bold'>${totalCartAmount}</span>
            </div>
          </div>
          <div className='mt-4'>
            <Button onClick={handleInitiatePaypalPayment} className="bg-[#0070ba] text-white hover:bg-red-700 w-[100%] rounded-[25px] font-bold  py-[4.2%] disabled={isPaymentStart}">
              {
                isPaymentStart ? 'Processing Paypal payment...':'Checkout with Paypal'
              }
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ShoppingCheckout