import CommonForm from '@/components/common/CommonForm';
import { loginFormControls } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { loginUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'

const initialState={
  userName:'',
  email:'',
  password:''
}

const Login = () => {
  const [formData,setFormData]=useState(initialState);
  const dispatch=useDispatch();
  const {toast}=useToast()
  function onSubmit(event){
   event.preventDefault();
   dispatch(loginUser(formData)).then((data)=>{
    if(data?.payload?.success){
      toast({ title:'logged in successfully', className: 'bg-green-500 text-white !important'})
    }else{
      toast({ title:'Incorrect password or email', className: 'bg-red-500 p-4 rounded-md ', // Tailwind classes for background, padding, and rounding
      style: {
        color: 'white', // Inline style to force white text
      },})
    } 
   })
  }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>Log In</h1>
      <p className='mt-2'>Don't have an account
        <Link className='font-medium ml-2 text-primary hover:underline' to='/auth/register'>Register</Link>
      </p>
      </div>
      <CommonForm  formControls={loginFormControls}
      buttonText ={'Sign Up'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}/>
    </div>
  )
}

export default Login