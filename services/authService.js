import axios from "axios";
export  const registerUser= async ({fullName,email,password})=>{
    const response =await axios.post( "http://localhost:5000/api/auth/register",{ fullName, email, password });
    return response.data;
}
export const loginUser=async({email,password})=>{
      const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
     );

  return response.data;
} 