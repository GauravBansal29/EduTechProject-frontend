
import { Context } from "../../context"
import axios from 'axios'
import UserRoute from '../../components/routes/UserRoute'
import { useEffect , useState} from "react";
const Payments= ()=>{

    const [paymentsdata , setPaymentsdata]= useState([]);
    const [user, setUser]= useState({});
    useEffect(()=>{
        const fetchUser= async ()=>{
            try{
            const {data}= await axios.get('/api/get-userdata');
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
           if(user && user.payments) axios.all(user.payments.map((item)=>axios.get(`/api/fetch-payment/${item}`))).then((data)=>{
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
        <div className="m-4">
        <div className="row text-center mb-3" style={{fontSize:"1rem" ,fontWeight:"bold", fontFamily:"Lato"}}>
        <div className="col-md-3" >Description</div>
        <div className="col-md-2">Payment Method</div>
        <div className="col-md-2">Amount Paid</div>
        <div className="col-md-4">Payment Id</div>
        </div>
       {paymentsdata.map((item)=>{
            return (
            <div className="row text-center mb-1" style={{fontSize:"0.9rem" , fontFamily:"Lato"}}>
            <div className="col-md-3 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}} >{item.description}</div>
            <div className="col-md-2 py-1 " style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.method}</div>
            <div className="col-md-2 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.amount/100}</div>
            <div className="col-md-4 py-1" style={{marginRight:"1px", backgroundColor:"#eeeeee"}}>{item.id}</div>

            </div>);
        })
    }
    </div>
    </UserRoute>);
}

export default Payments;