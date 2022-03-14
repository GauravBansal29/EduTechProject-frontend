import React, {useRef, useState} from "react"
import axios from "axios"
import {toast, ToastContainer} from "react-toastify"
import {SyncOutlined} from '@ant-design/icons'
import Link from 'next/link'
const Register= ()=>{
    const name= useRef(null);
    const email= useRef(null);
    const password= useRef(null);
    const [loading , setLoading] = useState(false);

    const onSubmitHandler= async (e)=>{
        e.preventDefault();
        //post request 
        try{
            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API}/register`, {
                    name: name.current.value,
                    email: email.current.value,
                    password: password.current.value
                });
            toast("Successful Registration");
            setLoading(false);
         }
         catch(err)
         {
             setLoading(false);
             console.log("Unsuccesful register"+ err);
             toast(err.response.data);

         }

    }
    return (
        <>
        <h1 className="bg-primary jumbotron text-white"> Register </h1>
        <div className ="row">
        <div className=" h-25 w-25 mh-auto col input-group m-3 bg-light">
        <form onSubmit={onSubmitHandler} >
        <div className="input-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your name" ref={name} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your email" ref={email} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input type="password" className="form-control" placeholder="Enter your Password" ref={password} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <button type="submit" className="form-control" disabled={loading}>{loading? <SyncOutlined spin/> : "SUBMIT"}</button>
        </div>
        </form>
        <div className="row text-center">
        Already Registered?
         <Link href="/login"><a>Login</a></Link>
        </div>
        </div>
        </div>
        </>
    );
}
export default Register;