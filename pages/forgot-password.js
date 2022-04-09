import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";
const forgotPassword= ()=>{
    const email=useRef();

    const onSubmitHandler= async(e)=>{
        e.preventDefault();
        try{
            const {data}= await axios.post('/api/generate-otp' ,{email: email.current.value});
            toast(data);
        }
        catch(err)
        {
            console.log(err);
            toast(err);
        }

    }
    return(
        <>
        <div className="col w-4" onSubmit={onSubmitHandler} style={{width:"fit-content"}}>
        <form>
        <div className="form-group pt-3">
        <input type="text" className="form-control " placeholder="Enter your email" ref={email} />
        </div>
        <div className="form-group pt-3">
        <button type="submit"  className="form-control " style={{height:'fit-content', width:'fit-content'}} >
        Submit
        </button>
        </div>
        </form>
        </div>
        </>
    );
}
export default forgotPassword