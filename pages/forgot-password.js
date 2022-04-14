import axios from "axios";
import { useRef , useState} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { WindowsFilled } from "@ant-design/icons";
const forgotPassword= ()=>{
    const [email, setEmail]= useState('');
    const [otp, setOtp]=useState('');
    const [entercode , setEntercode] =useState(false);
    const [verified , setVerified] =useState(false);
    const [password, setPassword] =useState('');
    const router =useRouter();
    const onSubmitHandler= async(e)=>{
        e.preventDefault();
        try{
            const res= await axios.post('/api/generate-otp' ,{email: email});
            if(res.status === 200)
            {
                toast(res.data);
                setEntercode(true);
                
            } 
        }
        catch(err)
        {
            console.log(err);
            toast(<><div>Request could not be processed</div>
                  <div>Please try again</div></>);
        }

    }
    const codeResponseHandler=async (e)=>{
        e.preventDefault();
        try{
        const res= await axios.post('/api/verify-otp', { email: email ,otp : otp});
        if(res.status ===200) setVerified(true);
        }
        catch(err)
        {
            console.log(err);
            toast('Verification unsuccessful');
            window.location.href='/forgot-password';
            
            
        }
    }

    const passwordchangeHandler=  async (e)=>{
        e.preventDefault();
        try{
            const res= await axios.post('/api/change-password', { email: email ,otp : otp, password:password});
            if(res.status===200) 
            {
                toast("Password changed successfully");
                router.push('/login');
            }

            
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured plz try again");
            window.location.href='/forgot-password';

        }
    }
    return(
        <>
        { entercode && !verified &&
            
                <div className="col w-4"  style={{width:"fit-content"}}>
                <h1>Enter your OTP</h1>
                <form onSubmit={codeResponseHandler}>
                <div className="form-group pt-3">
                <input type="text" className="form-control "  placeholder="Enter OTP"  onChange={(e)=>{setOtp(e.target.value)}} />
                </div>
                <div className="form-group pt-3">
                <button type="submit"  className="form-control " style={{height:'fit-content', width:'fit-content'}} >
                Submit
                </button>
                </div>
                </form>
                </div>
        } 
        { !entercode && !verified && 
                <div className="col w-4"  style={{width:"fit-content"}}>
                <h1>Enter your email id</h1>
                <form onSubmit={onSubmitHandler}>
                <div className="form-group pt-3">
                <input type="text" className="form-control " placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}} />
                </div>
                <div className="form-group pt-3">
                <button type="submit"  className="form-control " style={{height:'fit-content', width:'fit-content'}} >
                Submit
                </button>
                </div>
                </form>
                </div>
            
        }
        {
            verified && 
            <div className="col w-4"  style={{width:"fit-content"}}>
                <h1>Enter your password</h1>
                <form onSubmit={passwordchangeHandler}>
                <div className="form-group pt-3">
                <input type="text" className="form-control " placeholder="Enter your new password" onChange={(e)=>{setPassword(e.target.value)}} />
                </div>
                <div className="form-group pt-3">
                <button type="submit"  className="form-control " style={{height:'fit-content', width:'fit-content'}} >
                Submit
                </button>
                </div>
                </form>
            </div>
        }
        </>
        
    );
}
export default forgotPassword