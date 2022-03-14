import {useRef, useState} from "react"
import Link from "next/link"
import {toast, ToastContainer} from "react-toastify"
import axios from "axios"
import {SyncOutlined} from '@ant-design/icons'
const Login= ()=>{
    const email= useRef(null);
    const password= useRef(null);
    const [loading , setLoading] = useState(false);

    const onSubmitHandler= async (e)=>{
        e.preventDefault();
        //post request 
        try{
            setLoading(true);
            await axios.post(`${process.env.NEXT_PUBLIC_API}/login`, {
                    email: email.current.value,
                    password: password.current.value
                });
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
        <h1 className="bg-primary jumbotron text-white"> Login </h1>
        <div className ="row">
        <div className=" h-25 w-25 mh-auto col input-group m-3 bg-light">
        <form onSubmit={onSubmitHandler} >
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
        Not Registered?
         <Link href="/register"><a>Register</a></Link>
        </div>
        </div>
        </div>
        </>
    );
}
export default Login;