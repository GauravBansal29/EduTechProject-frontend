import React, {useContext, useRef, useState, useEffect} from "react"
import axios from "axios"
import {toast, ToastContainer} from "react-toastify"
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
import {useRouter} from "next/router"
import {Context} from "../context"
const Register= ()=>{
    const name= useRef(null);
    const email= useRef(null);
    const password= useRef(null);
    const contact=useRef(null);
    const [loading , setLoading] = useState(false);
    const router= useRouter();
    const {state, dispatch} = useContext(Context);
    const {user}= state;
    //if logged in -redirect
    useEffect(()=>{
        if(user) router.push("/");
    },[user])
    const onSubmitHandler= async (e)=>{
        e.preventDefault();
        //post request 
        try{
            setLoading(true);
           const res= await axios.post(`/api/register`, {
                    name: name.current.value,
                    email: email.current.value,
                    contact:contact.current.value,
                    password: password.current.value
                });
            toast("Successful Registration");
            setLoading(false);
         }
         catch(err)
         {
             setLoading(false);
             if(!err.response || err.response.status == 500) router.push("/err");
             else{
             console.log("Unsuccesful register"+ err);
             toast(err.response.data);
             }

         }

    }
    return (
        <>
        <div className ="row bg-light">
        <div className="col-md-8">
        <img src="/loginimage3.png" style={{width:"45rem"}}/>
        </div>
        <div className="col-md-4">
        <div className="px-3 py-4 mt-5 ml-4" style={{ fontSize:"1rem" ,width:'20rem', backgroundColor:"rgba(255,255,255)", boxShadow:"0 3px 10px rgb(0,0, 0,0.2)"}}>
        <form onSubmit={onSubmitHandler} >
        <div className="input-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your name" ref={name} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your email" ref={email} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input  type="number" className="form-control" placeholder="Enter your contact no." ref={contact} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input type="password" className="form-control" placeholder="Enter your Password" ref={password} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <button type="submit" className="form-control" disabled={loading}>{loading? <SyncOutlined spin/> : "SUBMIT"}</button>
        </div>
        </form>
        <div>
        Already Registered? &nbsp;
         <Link href="/login"><a>Login</a></Link>
        </div>
        </div>  
        </div>
        </div>
        </>
    );
}
export default Register;