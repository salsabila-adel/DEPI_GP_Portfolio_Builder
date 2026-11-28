import React, {  useState, useContext  } from 'react';
import style from "../../../src/Register.module.css";
import { useForm } from 'react-hook-form';
import * as zod from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/kalam/400.css';
import '@fontsource/kalam/700.css';
 import { registerUser } from "../services/authService";
import { AuthContext } from '../../Context/AuthContext';

// import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Signup() {
     // const navigate = useNavigate();
     const{user,token,isAuthenticated,setUser,setToken}=useContext(AuthContext);
      const [focusedInput,setFocusedInput]=useState(false);
      const[verrified1,setVerrified1]=useState(false);
      const[verrified2,setVerrified2]=useState(false);
      const[verrified3,setVerrified3]=useState(false);
      const[verrified4,setVerrified4]=useState(false);
       
      function validatePassword(e){
          if(e.target.value.length>=8&&e.target.value.length<=13){
              setVerrified1(true);
              
          }else{
            setVerrified1(false);
          }
          if(e.target.value.match(/^(?=.*[a-zA-Z])(?=.*[0-9]).+$/)){
              setVerrified2(true);
          }else{
            setVerrified2(false)
          }
           if(e.target.value.match(/(?=.*[A-Z])/)){
              setVerrified3(true);
          }else{
            setVerrified3(false)
          }
          if(e.target.value.match(/(?=.*[#@&$])/)){
            
            setVerrified4(true)
          }else{
              setVerrified4(false)
          }
          
        }
     
    
     const formSchema=zod.object({
        fullName:zod.string("Name must be string").nonempty("!This field is required").regex(/^[a-zA-Z]{3,}(?:\s[a-zA-Z]{3,}){1,2}$/,"Please enter your full name (2-3) names"),
        email:zod.string("Email must be string").nonempty("!This field is required").pipe(zod.email("!Invalid email")),
        password:zod.string("password must be string").nonempty("!This field is required").min(8,"password should be 8+ characters").max(13,"password mustn't exceed 13 characters").regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$&]).+$/),
        confPass:zod.string("confPass must be string").nonempty("!This field is required"),
        check:zod.boolean("must be bolean").refine((value)=>value,"must accept conditions")
    }).refine((value)=>(!value.confPass.trim()||value.password.trim()===value.confPass.trim()),{
       message:"!Confirm password should match your password ",
       path:['confPass']
    })
    const {handleSubmit,register,formState}=useForm({
        defaultValues:{
            fullName:"",
            email:"",
            password:"",
            confPass:"",
            check:false
        },
        mode:'onChange',
        resolver:zodResolver(formSchema),
        criteriaMode: "all"
    });
   
     const passwordProps=register('password');
   
   async function handleRegister({fullName,email,password}){
       try{
        
        const result=await registerUser({fullName,email,password});
        const token=result.data.token;
        const user=result.data.user;
         localStorage.setItem("token", token);
         setToken(token);
         setUser(user);
         
        toast.success('Account created successfully!', {
        autoClose: 2000})
      //onClose: () => navigate('/login'),
      //});
       }catch(error){
         console.log(error.response?.data||error.message);
         
        if (!error.response) {
         toast.error('Connection failed. Check your internet.', {
        autoClose: 4000
         });
       }
      else if (error.response.status === 409) {
         toast.error(error.response.data.message, {
         autoClose: 4000
      });
    }
    else if (error.response.status === 400) {
      toast.error('Please check your information', {
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
     
  return (
   <>
   <ToastContainer position="top-center" theme="colored" />
   <div className={style.page}>
    <section className={`d-flex justify-content-center align-items-center pt-5  ${style.formSection}`}>
      <form onSubmit={handleSubmit(handleRegister)}>
      <h2>Create your portfolio</h2>
      <h6 className='pt-2 '>Start free. Publish in minutes.</h6>
      <hr className='mt-4 mb-3'></hr>
      <div>
        <div className="mb-3  position-relative">
          <label htmlFor="FullName" className="form-label">Full Name</label>
          <div className={style.iconContainer}>
            <i className="fa-regular fa-user" style={{color:" rgb(122, 111, 116)"}}></i>
            
          </div>
          <input type="text" className={`form-control ${style.mainInput}`}  id="FullName" placeholder= 'Your full name' 
            {...register('fullName')}
          />
          <small className='text-danger'>{formState.errors.fullName?.message}</small>
         </div>
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
          <input onFocus={()=>setFocusedInput(true)} className={`form-control ${style.mainInput}`}  id="password"  placeholder='8+ characters'
            {...passwordProps}
            type='password'
            onChange={(e)=>{passwordProps.onChange(e);
                validatePassword(e)
            }}
          />
           <small className='text-danger'>{!focusedInput&&formState.errors.password?.message}</small>
          {focusedInput&&<div className='d-flex flex-column m-1'>
             <div className="form-check">
                <input
                 className={`form-check-input rounded-circle ${verrified1&&"bg-success border-0"}`}
                type="checkbox"
                disabled={!verrified1}
                checked={verrified1}
               />
              <label className={`form-check-label ${verrified1&&"text-success"}`}>
               Must be in range 8-13 characters
              </label>
             </div>
             <div className="form-check">
                <input
                className={`form-check-input rounded-circle ${verrified2&&"bg-success border-0"}`}
                type="checkbox"
                disabled={!verrified2}
                checked={verrified2}
               />
              <label className={`form-check-label ${verrified2&&"text-success"}`}>
               Must contain numbers and characters 
              </label>
             </div>
             <div className="form-check">
                <input
                className={`form-check-input rounded-circle ${verrified3&&"bg-success border-0"}`}
                type="checkbox"
                disabled={!verrified3}
                checked={verrified3}
               />
              <label className={`form-check-label  ${verrified3&&"text-success"}`}>
                At least one capital letter
              </label>
             </div>
             <div className="form-check">
                <input
                 className={`form-check-input rounded-circle ${verrified4&&"bg-success border-0"} `}
                type="checkbox"
                disabled={!verrified4}
                checked={verrified4}
               />
              <label className={`form-check-label  ${verrified4&&"text-success"}`}>
               At least one special character(#-@-&-$)
              </label>
             </div>
          </div>}
          
        </div>
        <div className="mb-3 position-relative">
          <label htmlFor="confPass" className="form-label">Confirm password</label>
          <div className={style.iconContainer}>
            <i className="fa-solid fa-lock" style={{color:" rgb(122, 111, 116)"}}></i>
        
          </div>
          <input type="password" className={`form-control ${style.mainInput}`} id="confPass"  placeholder='Confirm your password'
           {...register('confPass')}
          />
          <small className='text-danger'>{formState.errors.confPass?.message}</small>
        </div>
        <div className="form-check">
          <input type="checkbox" id="gridCheck" className={`form-check-input ${style.checkBox}`}
           {...register('check')}
          />
          <label htmlFor="gridCheck" className='form-check-label ps-2'>
            I agree to the Terms and Privacy Policy
        </label>
        </div>
        <button type='submit' className={`btn mt-3 w-100 ${style.submitBtn}`}>Create account</button>
         <div className="d-flex justify-content-center align-items-center mb-2">
             <p className='m-3'>Already have an account?<span className={style.loginLink}> Login</span></p>
         </div>
      </div>
      
   </form>
     
    </section>
    
   </div>
   </>
  )
}
 
