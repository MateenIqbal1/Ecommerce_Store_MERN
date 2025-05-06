import CommonForm from '@/components/common/CommonForm';
import { registerFormControls } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/store/auth-slice';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'

const initialState={
  userName:'',
  email:'',
  password:''
}

const Register = () => {
  const [formData,setFormData]=useState(initialState);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {toast}=useToast()

  function onSubmit(e){
  e.preventDefault();
  dispatch(registerUser(formData)).then((res) => {
    console.log('RegisterUser response:', res);
    if (res.meta.requestStatus === 'fulfilled') {
      toast({
        title:res.payload?.message
      })
      navigate('/auth/login');
    }else{
     toast({title:res.payload?.message,
      style: {
        backgroundColor: 'red',  // Set the background color to red
        color: 'white',          // Set the text color to white
      },
    
    }) 
    }
  });
  }
  console.log(formData)
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className="text-center">
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>create new account</h1>
      <p className='mt-2'>Already have an account
        <Link className='font-medium ml-2 text-primary hover:underline' to='/auth/login'>Login</Link>
      </p>
      </div>
      <CommonForm  formControls={registerFormControls}
      buttonText ={'Sign Up'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}/>
    </div>
  )
}

export default Register