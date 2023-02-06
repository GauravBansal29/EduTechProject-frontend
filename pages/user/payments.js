
import { Context } from "../../context"
import axios from 'axios'
import UserRoute from '../../components/routes/UserRoute'
import { useEffect , useState} from "react";
import {Empty} from 'antd'
const Payments= ()=>{

    const [paymentsdata , setPaymentsdata]= useState([]);
    const [user, setUser]= useState({});
    useEffect(()=>{
        const fetchUser= async ()=>{
            try{
            const {data}= await axios.get('https://backend-coursebay.onrender.com/api/get-userdata');
            setUser(data);
            }
            catch(err)
            {
                console.log(err);
            }

        }
        fetchUser();
    }, [])

    useEffect(()=>{
    
        const fetchPayments= ()=>{
            console.log(user);
           if(user && user.payments) axios.all(user.payments.map((item)=>axios.get(`https://backend-coursebay.onrender.com/api/fetch-payment/${item}`))).then((data)=>{
                console.log(data);
                
                let x=data.map((r)=>{
                    if(r.data && r.data.items && r.data.items.length >0) return r.data.items[0];
                })
                console.log(x);
               setPaymentsdata(x);
                
             }, (err)=>{
                 console.log(err);
             })
        } 

        fetchPayments();
    },[user]);

    return (
    <UserRoute>
        <div className="m-3">
        <h3  style={{fontFamily:"Merriweather", fontWeight:"bold"}} className="ms-2 mt-4" >Your Payments</h3>
        {paymentsdata.length >0 && <div className="m-4">
        <div className="row text-center mb-3" style={{fontSize:"1rem" ,fontWeight:"bold", fontFamily:"Lato"}}>
        <div className="col-md-3" >Description</div>
        <div className="col-md-2">Payment Method</div>
        <div className="col-md-2">Amount Paid</div>
        <div className="col-md-4">Payment Id</div>
        </div>
        
      { paymentsdata.map((item)=>{
            return (
            <div className="row text-center mb-1" style={{fontSize:"0.9rem" , fontFamily:"Lato"}}>
            <div className="col-md-3 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}} >{item.description}</div>
            <div className="col-md-2 py-1 " style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.method}</div>
            <div className="col-md-2 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.amount/100}</div>
            <div className="col-md-4 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.id}</div>

            </div>);
        })}
    
    </div>}
    {
        paymentsdata.length ==0 && <div className="text-center" style={{width:"100%", height:"80%"}}><Empty /></div>
    }
    <div className="m-3 me-5 p-3 mt-5 ms-auto me-auto" style={{fontSize:"1rem" ,width:"fit-content", fontFamily:"Lato" , backgroundColor:"#eeeeee"  }}>
     <b>Note:</b> For any queries / issues related to payments contact support at <b>9654004473</b>
    </div>
    </div>
    </UserRoute>);
}

export default Payments;