import  {   useContext, useState  } from 'react';
import style from "../../../src/Register.module.css"
import { useForm } from 'react-hook-form'
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/kalam/400.css'
import '@fontsource/kalam/700.css'
import { loginUser } from '../services/authService';
 import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../Context/AuthContext';
export default function Login() {
     const{user,token,isAuthenticated,setUser,setToken}=useContext(AuthContext);
      
     const formSchema=zod.object({
        email:zod.string("Email must be string").nonempty("!This field is required").pipe(zod.email("!Invalid email")),
        password:zod.string().nonempty("!This field is required").min(8,"password should be 8+ characters").max(13,"password mustn't exceed 13 characters"),
       
        })
    const {handleSubmit,register,formState}=useForm({
        defaultValues:{
            
            email:"",
            password:"",
            
        },
        mode:'onChange',
        resolver:zodResolver(formSchema),
        criteriaMode: "all"
    });
    async function handleLogin({email,password}){
        if (password.match(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&]).+$/)){
           try{
             const result=await loginUser({email,password});
              localStorage.setItem("token", result.data.token);
              console.log(result)
              setUser(result.data.user);
              setToken(result.data.token);
            toast.success('Logged in successfully!', {
             autoClose: 2000})
           }catch(error){
             
              if (!error.response) {
               toast.error('Connection failed. Check your internet.', {
                autoClose: 4000
               });
               }
              else if (error.response.status === 400) {
                    toast.error('Please check your email and password and try again', {
                    autoClose: 4000
               });
               }
              else if (error.response.status === 401) {
                 toast.error('Invalid email or password', {
                 autoClose: 4000
              });
              }
               else if (error.response.status === 429) {
                toast.error('Too many attempts. Try again in 15 min', {
                autoClose: 4000
                });
                }
           else {
            toast.error('Something went wrong. Please try again', {
             autoClose: 4000
              });
             }
           }
        }
        else{
           toast.error('Invalid password format',{
            autoClose:2000
           })
        }
        
     }
  return (
   <>
   <ToastContainer position="top-center" theme="colored" />
   <div className={style.page}>
    <section className={`d-flex justify-content-center align-items-center pt-5  ${style.formSection}`}>
      <form onSubmit={handleSubmit(handleLogin)}>
      <h2>Welcome back</h2>
      <h6 className='pt-2 '>Log in to continue building your portfolio.</h6>
      <hr className='mt-4 mb-3'></hr>
      <div>
        
        <div className="mb-3  position-relative">
          <label htmlFor="email" className="form-label">Email</label>
          <div className={style.iconContainer}>
            <i className="fa-regular fa-envelope" style={{color:" rgb(122, 111, 116)"}}></i>
           
          </div>
          <input type="email" className={`form-control ${style.mainInput}`}  id="email" placeholder='you@example.com'  
           {...register('email')}
           
          />
          <small className='text-danger'>{formState.errors.email?.message}</small>
        </div>
        <div className="mb-3  position-relative">
          <label htmlFor="password" className="form-label">Password</label>
          <div className={style.iconContainer} >
            <i className="fa-solid fa-lock" style={{color:" rgb(122, 111, 116)"}}></i>
        
          </div>  
          
          <input  className={`form-control ${style.mainInput}`}  id="password"  placeholder='8+ characters'
            
            type='password'
            {...register('password')}
          />
           <small className='text-danger'>{formState.errors.password?.message}</small>
          
          
        </div>
        
       
        <button type='submit' className={`btn mt-4 w-100 p-2 ${style.submitBtn}`}>Log in</button>
         <div className="d-flex justify-content-center align-items-center mb-2">
             <p className='m-3 pt-3'>New here?<span className={style.loginLink}> Create an account</span></p>
         </div>
      </div>
      
   </form>
     
    </section>
    
    
   </div>
   </>
  )
}
 
