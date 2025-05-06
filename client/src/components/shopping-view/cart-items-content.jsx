import { Minus, Plus, Trash } from 'lucide-react';
import React from 'react'
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';

export default function UserCartItemsContent({ cartItem }) {
  const {user}=useSelector(state=>state.auth)
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const {toast} =useToast()
const dispatch=useDispatch()

  function handleCartItemDelete(getItem){
  dispatch(deleteCartItem({userId : user?.id,productId:getItem?.productId}))
  }
  function handleUpdateQuantity(getCartItem,typeOfAction){

    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock");

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              className: "bg-red-500 text-white !important",
            });

            return;
          }
        }
      }
    }
    dispatch(updateCartQuantity({userId:user?.id, productId : getCartItem?.productId,
      quantity : typeOfAction==='plus' ? getCartItem?.quantity+1 : getCartItem?.quantity-1 

    })).then(data=>{
      if(data?.payload?.success){
        console.log('cart updated successfully')
      }
    })
  }
  console.log(cartItem,'this is cART ITEM');
  return (
    <div className='flex items-center space-x-4'>
      <img src={cartItem?.image} alt={cartItem?.title} className='w-18 h-20 rounded object-cover'/>
       <div className="flex-1">
        <h3 className='font-extrabold'>{cartItem?.title}</h3>
        <div className="flex items-center gap-5 mt-1">
          <Button onClick={()=>handleUpdateQuantity(cartItem ,'minus')} variant='outline' size='icon' disabled={cartItem?.quantity===1} className='w-8 h-8 rounded-full'>
            <Minus className='w-4 h-4'/>
            <span className='sr-only'>Decrease</span>
          </Button>
          <span className='font-semibold'>{cartItem?.quantity}</span>
          <Button onClick={()=>handleUpdateQuantity(cartItem ,'plus')}  variant='outline' size='icon' className='w-8 h-8 rounded-full'>
            <Plus className='w-4 h-4'/>
            <span className='sr-only'>Increase</span>
          </Button>
        </div>
       </div>
       <div className='flex flex-col items-end'>
        <p className='font-semibold'>
          ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price ) * cartItem?.quantity).toFixed(2)}
        </p>
        <Trash onClick={()=>handleCartItemDelete(cartItem)} className='cursor-pointer mt-1' size={20}/>
       </div>
    </div>
  );
}


