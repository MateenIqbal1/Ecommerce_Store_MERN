import React from 'react';
import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import UserCartItemsContent from './cart-items-content';
import { useNavigate } from 'react-router-dom';


export default function UserCartWrapper({cartItems ,setOpenCartSheet}) {
  const navigate=useNavigate()
  const totalCartAmount = cartItems && cartItems.length > 0 ? cartItems.reduce((sum,currentItem)=>sum+(
    currentItem?.salePrice > 0  ? currentItem?.salePrice : currentItem?.price)* currentItem?.quantity ,0) :0
  return (
    <SheetContent className="sm:max-w-md bg-white text-black p-4">
      <SheetHeader>
        <SheetTitle>
          Your Cart
        </SheetTitle>
      </SheetHeader>
      <div className='mt-8 space-y-4'>
       {
        cartItems && cartItems.length > 0 ? 
        cartItems.map(item=> <UserCartItemsContent  cartItem={item}/>) : null
       }
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
            <span className='font-bold'>Total</span>
            <span className='font-bold'>${totalCartAmount}</span>

        </div>
      </div>
      <Button onClick={()=>{navigate('/shop/checkout');  setOpenCartSheet(false)}} className='w-full mt-5 bg-blue-500 hover:bg-blue-600 text-white'>
       CheckOut
      </Button>
    </SheetContent>
  );
}
