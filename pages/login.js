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
                console.log(res);
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
             console.log("entered error block");
             console.log(err);
             setLoading(false);
             if(!err.response || err.response.status == 500) router.push("/err");
             else{
             console.log("Unsuccesful login"+ err);
             toast(err.response.data);
             email.current.value="";
             password.current.value="";
         }

    }
}

    return (
        <>
        {/* <img src="loginimage1.png" style={{width:"20rem"}}/>
        <img src="loginimage2.png" style={{width:"20rem"}}/>
        
        <img src="loginimage4.png" style={{width:"20rem"}}/> */}
        <div className="row bg-light">
        <div className="col-md-8">
        <img src="/loginimage3.png" style={{width:"45rem"}}/>
        </div>
        <div className="col-md-4">
        <div className="p-3 mt-5 ml-4" style={{ fontSize:"1rem" ,width:'20rem', backgroundColor:"rgba(255,255,255)", boxShadow:"0 3px 10px rgb(0,0, 0,0.2)"}} >
        <form onSubmit={onSubmitHandler} style={{width:'100%'}} >
        <div className="form-group mb-3 mx-auto">
        <input  type="text" className="form-control" placeholder="Enter your email" ref={email} />
        </div>
        <div className="input-group mb-3 mx-auto">
        <input type="password" className="form-control" placeholder="Enter your Password" ref={password} />
        </div>
        <div className="input-group mb-3 mx-auto ">
        <button type="submit" className="form-control" disabled={loading}>{loading? <SyncOutlined spin/> : "SUBMIT"}</button>
        </div>
        </form>
        
        <div className="input-group mb-3 text-center mx-auto">
        Not Registered?&nbsp;&nbsp;
         <Link href="/register"><a>Register</a></Link>
        </div>
        <div className="input-group mb-3 text-center mx-auto">
        <Link href="/update-password"><a>Forgot Password?</a></Link>
        </div>
        </div>
        </div>
        </div>

        </>
    );
}
export default Login;
