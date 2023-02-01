import {useState, useEffect} from 'react'
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios'
import {UpOutlined, DownOutlined} from '@ant-design/icons'
import {Modal} from 'antd'
const InstructorAccount= ()=>{
    const [user,setUser]= useState({}); 
    const [payoutdata, setPayoutdata]= useState([]);
    const [revenue, setRevenue]=useState(0);
    const [paidout, setPaidout]=useState(0);
    const [collapse , setCollapse]=useState(true);
    const [showModal, setShowModal]=useState(false);
    const [values, setValues]= useState({
        name: "",
        account_number: "",
        ifsc_code:""
       });

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
        const getPayoutData= async ()=>{
            console.log(user);
            if(user && user.payments) axios.all(user.payouts.map((item)=>axios.get(`https://backend-coursebay.onrender.com/api/fetch-payout/${item}`))).then((data)=>{
                console.log(data);
               let x= data.map((item)=>{
                   setPaidout(()=>{
                      if(item.data.status == "processed") return paidout+ (item.data.amount)/100;
                      else return paidout;
                   })
                   setRevenue(()=>{
                       return revenue+ (item.data.amount)/100;
                   })

                    return {amount: item.data.amount , payoutid: item.data.id , payoutstatus:item.data.status, createdAt:item.data.created_at }
                })

                setPayoutdata(x);
                
            //     let x=data.map((r)=>{
            //         if(r.data && r.data.items && r.data.items.length >0) return r.data.items[0];
            //     })
            //     console.log(x);
            //    setPaymentsdata(x);
                
             }, (err)=>{
                 console.log(err);
             })
        }
        getPayoutData();
    },[user]);


    const handleSubmit=async(e)=>{
        try{
        e.preventDefault();
        console.log(values);
        const res= await axios.post('https://backend-coursebay.onrender.com/api/add-fundaccount',{
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
        setShowModal(false);
    }

    return (
        <InstructorRoute>
        <div className='m-3 ms-5'>
        <div className='row mt-4'>
        <div className='col-md-3' style={{borderRadius:"10px" ,fontSize:"2rem" ,fontFamily:"Lato" , color:"white", background:"linear-gradient(0deg, rgba(147,91,216,1) 0%, rgba(205,189,255,1) 48%, rgba(234,217,255,1) 100%)"}}>
        <b>Revenue generated</b>
        <div>{revenue}</div>
        </div>
        <div className='col-md-1'></div>
        <div className='col-md-3 bg-primary' style={{borderRadius:"10px" ,fontSize:"2rem" ,fontFamily:"Lato" , color:"white", background:"linear-gradient(0deg, rgba(147,91,216,1) 0%, rgba(205,189,255,1) 48%, rgba(234,217,255,1) 100%)"}}>
        <b>Payments processed </b>
        <div>{paidout}</div>
        </div>
        <div className='col-md-1'></div>
        <div className='col-md-3 bg-primary' style={{borderRadius:"10px" ,fontSize:"2rem" ,fontFamily:"Lato" , color:"white", background:"linear-gradient(0deg, rgba(147,91,216,1) 0%, rgba(205,189,255,1) 48%, rgba(234,217,255,1) 100%)"}}>
        <b>Payments Processing</b>
        <div>{revenue -paidout}</div>
        </div>
        </div>
        <div>
        <h4 className=" mt-3 ps-3 pe-5" style={{ marginRight:"5rem" ,borderRadius:"5px", fontFamily:"Merriweather", fontWeight:"bold", fontSize:"2rem" ,fontFamily:"Lato" , color:"white",backgroundColor:"rgba(147,91,216,1)" }}  onClick={()=>{setCollapse(!collapse)}}>Payouts &nbsp;{collapse? <DownOutlined/> : <UpOutlined/>}</h4>
        { !collapse &&  <><div className="row text-center mb-1 ms-5" style={{fontSize:"1rem" , fontFamily:"Lato", fontWeight:"bold"}}>
        <div className="col-md-2" style={{fontSize:"1.1rem" ,marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.9)"}}>Amount</div>
        <div className="col-md-2" style={{fontSize:"1.1rem" ,marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.9)"}}>Status</div>
        <div className="col-md-3" style={{fontSize:"1.1rem" ,marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.9)"}}>Payout Id</div>
        <div className="col-md-3" style={{fontSize:"1.1rem" ,marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.9)"}}>Created At</div>
        </div>
        { payoutdata.map((item)=>{
            return (
            <div className="row text-center mb-1 ms-5" style={{fontSize:"0.9rem" ,fontFamily:"Lato"}}>
            <div className="col-md-2 py-1" style={{marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.7)"}} >{item.amount /100}</div>
            <div className="col-md-2 py-1 " style={{marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.7)"}}>{item.payoutstatus}</div>
            <div className="col-md-3 py-1" style={{marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.7)"}}>{item.payoutid}</div>
            <div className="col-md-3 py-1" style={{marginRight:"1px",color:"white", backgroundColor:"rgba(147,91,216,0.7)"}}>{new Date(item.createdAt *1000).toLocaleDateString()}</div>

            </div>);
        })}</>}
        </div>
        
        <div>
        <button className='btn' style={{marginTop:"1rem",backgroundColor:"rgba(147,91,216,0.9)" , color:"white"}} onClick={()=>{setShowModal(true)}}>Change account details</button>
        </div>
        </div>

        {
            showModal &&
            <Modal
            title="Add your bank details"
            centered
            visible={showModal}
            onCancel={()=>{setShowModal(false);}}
            footer={null}
            style={{padding:"1rem"}}>
            <form>
            <input placeholder='Add your name as mentioned in account' className='form-control mb-2' value={values.name} onChange={(e)=>{setValues({...values, name: e.target.value})}} />
            <input placeholder='Add your account number' className='form-control mb-2' value={values.account_number} onChange={(e)=>{setValues({...values, account_number: e.target.value})}} />
            <input placeholder='Add the bank IFSC Code' className='form-control mb-2' value={values.ifsc_code} onChange={(e)=>{setValues({...values, ifsc_code: e.target.value})}}/>
            <button className=' mt-2 ms-auto me-0 btn btn-primary' onClick= {handleSubmit} >Submit</button>
            </form>
            </Modal>
        }
        </InstructorRoute>
    );
}

export default InstructorAccount;