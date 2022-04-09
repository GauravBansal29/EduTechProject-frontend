import {useRef, useState , useContext, useEffect} from "react"
import Link from "next/link"
import {toast, ToastContainer} from "react-toastify"
import axios from "axios"
import {SyncOutlined} from '@ant-design/icons'
import {Context} from "../context"
import {useRouter} from 'next/router'
const Login= ()=>{
    const email= useRef(null);
    const password= useRef(null);
    const [loading , setLoading] = useState(false);

    const router = useRouter();
    //state
    const {state, dispatch} =useContext(Context);
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
           const res= await axios.post(`/api/login`, {
                    email: email.current.value,
                    password: password.current.value
                });
            setLoading(false);

            // add to context the user data (jwt already sent to cookie)
            dispatch({
                type:"LOGIN",
                payload: res.data
            });
            
            //add to local-storage to prevent loss against page refresh
           localStorage.setItem("user", JSON.stringify(res.data));

           //redirect
            router.push('/');

         }
         catch(err)
         {
             setLoading(false);
             if(!err.response || err.response.status == 500) router.push("/err");
             else{
             console.log("Unsuccesful login"+ err);
             toast(err.response.data);
             }
            

         }

    }

    return (
        <>
        <h1 className="bg-primary jumbotron text-white"> Login </h1>

        <div className="p-3 my-auto mx-auto bg-light" style={{ width:'fit-content'}}>
        <form onSubmit={onSubmitHandler} style={{width:'100%'}} >
        <div className="form-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your email" ref={email} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input type="password" className="form-control w-30" placeholder="Enter your Password" ref={password} />
        </div>
        <div className="input-group mb-3 mx-auto ">
        <button type="submit" className="form-control w-10" disabled={loading}>{loading? <SyncOutlined spin/> : "SUBMIT"}</button>
        </div>
        </form>
        <div className="input-group mb-3 text-center mx-auto">
        Not Registered?&nbsp;&nbsp;
         <Link href="/register"><a>Register</a></Link>
        </div>
        <div className="input-group mb-3 text-center mx-auto">
        <Link href="/forgot-password"><a>Forgot Password?</a></Link>
        </div>
        </div>
        </>
    );
}
export default Login;