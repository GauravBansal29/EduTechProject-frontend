import axios from 'axios'
import { useRouter , Router } from 'next/router';
import {Modal} from 'antd'
import {useState, useContext} from 'react'
import { toast } from "react-toastify";
import { Context } from "../../context"
const becomeInstructor=  ()=>{
    const {state: {user}, dispatch} = useContext(Context);
    const router= useRouter();
    const [visible, setVisible]= useState(false);
    const [values, setValues]= useState({
     name: "",
     account_number: "",
     ifsc_code:""
    });
    const userOnboarding= async()=>{
        // backend will send us a link where we need to redirect user then the stripe will do its authentication and redirect back to us

        try{
            const res =await axios.post(`/api/add-contact`);
            console.log(res.data);
            //on successful response we will send the modal asking for account details to make a fund account id 
            setVisible(true);
            

        }
        catch(err)
        {
            console.log("RAZORPAY CONTACT NOT MADE", err);
            toast("Some error occured")
            router.push('/err');
        }
    
    }

    const handleSubmit=async(e)=>{
        try{
        e.preventDefault();
        console.log(values);
        const res= await axios.post('/api/add-fundaccount',{
            name: values.name,
            account_number: values.account_number,
            ifsc: values.ifsc_code
        });
        toast("Successfully added bank details");
        dispatch({
            type: "LOGIN",
            payload: res.data,
        })
        localStorage.setItem("user", JSON.stringify(res.data));
        window.location.href= "/instructor";
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured, Try again");
            
        }
        setVisible(false);
    }

    return( 
    <>
    
    <div className='row'>

    <div className='row'>
    <div className='col-md-8 mt-5 text-center' style={{fontSize:"3rem"}}>
    <div className="px-5 pb-2" style={{fontFamily:"Merriweather", fontWeight:"bold"}}>Become an Instructor</div>
    <div className='px-5'><button className="btn btn-primary" style={{ fontSize:"1.2rem"}} onClick= {userOnboarding}>Setup with your bank details</button></div>
    </div>
    <div className='col-md-4 text-center'>
    <img src="/instructor5.jpg" style={{width:"25rem", height:"14rem"}}  />
    <div style={{fontWeight:"bold"}}>Get Full Support from Our Side</div>
    </div>
    </div>
    <div className='row'>
    <div className='col-md-4 text-center'>
    <img src="/instructor2.jpg" style={{width:"15rem", height:"14rem"}}  />
    <div style={{fontWeight:"bold"}} >Make high quality videos to stand out</div>
    </div>
    <div className='col-md-4 text-center'>
    <img src="/instructor3.jpg" style={{width:"15rem", height:"14rem"}}  />
    <div style={{fontWeight:"bold"}}>Interact with students </div>
    </div>
    <div className='col-md-4 text-center'>
    <img src="/instructor1.jpg" style={{width:"15rem", height:"14rem"}}  />
    <div style={{fontWeight:"bold"}} >Engage your students </div>
    </div>
    </div>
    </div>
    
    
    <Modal
    title="Add your bank details"
    centered
    visible={visible}
    onCancel={()=>{setVisible(false);}}
    footer={null}
    style={{padding:"1rem"}}>
    <form>
    <input placeholder='Add your name as mentioned in account' className='form-control mb-2' value={values.name} onChange={(e)=>{setValues({...values, name: e.target.value})}} />
    <input placeholder='Add your account number' className='form-control mb-2' value={values.account_number} onChange={(e)=>{setValues({...values, account_number: e.target.value})}} />
    <input placeholder='Add the bank IFSC Code' className='form-control mb-2' value={values.ifsc_code} onChange={(e)=>{setValues({...values, ifsc_code: e.target.value})}}/>
    <button className=' mt-2 ms-auto me-0 btn btn-primary' onClick= {handleSubmit} >Submit</button>
    </form>
    </Modal>

    </>);
}
export default becomeInstructor;