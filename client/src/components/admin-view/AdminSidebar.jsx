import { adminSidebarMenuItems } from '@/config'
import {  ChartNoAxesCombined ,LayoutDashboard,ShoppingBasket,BadgeCheck} from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'


function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  
  return (
    <nav className="mt-8 flex-col flex gap-2">
      {
        adminSidebarMenuItems.map((menuItem) => (
          <div 
            key={menuItem.id} 
            onClick={() => {
              navigate(menuItem.path); // Navigate to the path
              if (setOpen) {
                setOpen(false); // Close the sheet if setOpen is provided
              }
            }} 
            className="flex items-center gap-2 rounded-md px-3 py-2 bg-gray-900 text-white cursor-pointer text-xl"
          >
            {/* Correct way to render the icon */}
            <menuItem.icon size={24} strokeWidth={2} color="white" />
            <span>{menuItem.label}</span>
          </div>
        ))
      }
    </nav>
  );
}

const AdminSidebar = ({open,setOpen}) => {
  const navigate=useNavigate()
  return (
    <Fragment>
     
     <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64">
      <div className='flex flex-col h-full'>
         <SheetHeader className='border-b'>
         <SheetTitle className='flex gap-2 mt-5'>
          <ChartNoAxesCombined size={30}/>
         <span>Admin Panel</span> 
         </SheetTitle>
         </SheetHeader>
         <MenuItems setOpen={setOpen}/>
      </div>
      </SheetContent>
     </Sheet>

      
      <aside className='hidden w-64 flex-col border-r bg-background p-6 lg:flex'>
        <div onClick={()=>navigate('/admin/dashboard')} className='cursor-pointer flex-items-center gap-2 '>
        <ChartNoAxesCombined size={30} />
          <h1 className='text-2xl font-extrabold '>Admin panel</h1>
        </div>
        <MenuItems/>
      </aside>
      </Fragment>
  )
}

export default AdminSidebar