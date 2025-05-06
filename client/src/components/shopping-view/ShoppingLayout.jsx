
import React from 'react'
import ShoppingHeader from './ShoppingHeader'
import { Outlet } from 'react-router-dom'

const ShoppingLayout = () => {
  return (
<div className="kuchbhi flex flex-col bg-white overflow-hidden ">
{/* common header */}
<ShoppingHeader />
<main className="flex flex-col w-full">
    <Outlet /> 
</main>
</div>
    )
}

export default ShoppingLayout