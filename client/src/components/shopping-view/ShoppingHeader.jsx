import { ShoppingBag, LogOut, Menu, ShoppingCart, UserCog } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { shoppingViewHeaderMenuItems } from '@/config'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { logoutUser, resetTokenAndCredentials } from '@/store/auth-slice'
import UserCartWrapper from './cart-wrapper'
import { fetchCartItems } from '@/store/shop/cart-slice'
import { Label } from '../ui/label'


function MenuItems({ setIsMenuOpen }){
  const navigate=useNavigate();
  const location = useLocation()
  const [searchParams , setSearchParams] = useSearchParams() 
  function handleNavigate(getCurrentMenuItem){
   sessionStorage.removeItem('filters')
   const currentFilter=getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' && getCurrentMenuItem.id !== 'search' ?  {
    category:[getCurrentMenuItem.id]
   }:null
   sessionStorage.setItem('filters',JSON.stringify(currentFilter))
   location.pathname.includes('listing') && currentFilter !== null ?
   setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
     :
     navigate(getCurrentMenuItem.path)

     if (setIsMenuOpen) { // <-- New: Closes the menu if setIsMenuOpen is passed
      setIsMenuOpen(false);
    }
  }
  return (
  <nav className='flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:gap-10 lg:flex-row  '>
{
  shoppingViewHeaderMenuItems.map(menuItem=><Label onClick={()=>handleNavigate(menuItem)} className=' font-serif text-[17px] tracking-wide cursor-pointer' key={menuItem.id} to={menuItem.path}>{menuItem.label}</Label>)
}
  </nav>)
}

function HeaderRightContent(){
 
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const {user }=useSelector(state=>state.auth)
  const {cartItems}=useSelector(state=>state.shopCart) 
  const [openCartSheet,setOpenCartSheet]=useState(false)
   const userName = user?.userName ? user.userName : "Guest";

   function handleLogout(){
  //  dispatch(logoutUser())
     dispatch(resetTokenAndCredentials())
     sessionStorage.clear()
     navigate('/auth/login')
   }
   const isLoading = useSelector((state) => state.shopCart.isLoading);

   useEffect(()=>{
    dispatch(fetchCartItems(user?.id))
   },[dispatch])

   return (
    <div className='flex lg:items-center lg:flex-row flex-col gap-5 lg:gap-7 lg:mr-2'>
      <Sheet open={openCartSheet} onOpenChange={()=>setOpenCartSheet(false)}> 
        <Button onClick={()=>setOpenCartSheet(true)} variant='outline' size='icon' className='relative'>
           <ShoppingCart className='w-6 h-6'/>
           <span className='absolute top-[-5px] right-[2px] text-bold'>{cartItems?.items?.length || 0}</span>
           <span className='sr-only'>User cart</span>
     </Button>
     <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
      </Sheet>
     
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
         <Avatar className='bg-black'>
          <AvatarFallback className='bg-black text-white font-extrabold'>
       {user?.userName[0].toUpperCase()}
          </AvatarFallback>
         </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' className='w-56 bg-gray-500 text-white'>
          <DropdownMenuLabel>
            {/* Hardcoded text for debugging */}
            Logged in as <span className='font-semibold'>{userName}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={()=>navigate('/shop/account')}>
            <UserCog className='mr-2 h-4 w-4'/>
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
           <LogOut className='mr-2 h-4 w-4 '/>
           Logout
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
   )
}
const ShoppingHeader = () => {
  const {isAuthenticated }=useSelector(state=>state.auth)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className='mb-6 sm:mb-0 '>
   <header className=' sticky  top-0 right-1 left-1 z-40 w-full border-b  shadow-md bg-[#2E8B57] lg:text-white'>
  <div className=' flex h-16 items-center justify-between px-4 md:px-6'>
  <Link to='/shop/home' className='flex items-center gap-2 lg:gap-5 ml-0 sm:ml-4'>
  <ShoppingBag  className='h-6 w-6'/>
  <span className='font-bold'>Ecommerce</span>
  </Link>
  <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className='lg:hidden'>
      <Menu className='h-6 w-6 '/>
         <span className='sr-only'>Toggle Header Menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side='left' className='w-full max-w-xs bg-white'>
      <MenuItems  setIsMenuOpen={setIsMenuOpen} />
      <HeaderRightContent />
    </SheetContent>
  </Sheet>
  <div className='hidden lg:block'>
  <MenuItems />
  </div>
   <div className='hidden lg:block '>
      <HeaderRightContent />
    </div> 
  </div>
   </header></div>
  )
}

export default ShoppingHeader