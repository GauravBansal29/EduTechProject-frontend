import {useState , useEffect, useContext} from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import {Badge, Card, Modal, List, Avatar} from 'antd'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'
import { Context } from "../../context"
import { toast } from "react-toastify";

const SingleCourse= ({course})=>{
    const {_id, name, description, price,paid , instructor, updatedAt, lessons, image, category}= course;
    const [modalvisible, setModalvisible]= useState(false);
    const [videoplayidx, setVideoplayidx]= useState(-1);
    const [videolink, setVideolink]= useState("");
    const [enrolled , setEnrolled]= useState(false);
    const [loading, setLoading]=useState(false);
    const router= useRouter();
    const {slug}= router.query;
    const {state: {user}, dispatch}= useContext(Context);
    console.log(user);
    useEffect(()=>{
        const checkEnrollment= async ()=>{
            try{
                const {data}= await axios.get(`/api/check-enrollment/${slug}`);
                if(Object.keys(data.answer).length !== 0) setEnrolled(true);
            }
            catch(err)
            {
                console.log(err);
                toast("Some error occured");
                router.push("/err");
            }
        }
        checkEnrollment();
    }, []);

    const handleFreeEnrollment=async()=>{
        console.log("Free Enrollment");
        try{
            const res= await axios.put(`/api/free-enrollment/${_id}`);
           if(res.status ==200) 
           {
               toast("Successfully enrolled");
               setEnrolled(true);
           }

        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured");
            router.push('/err');
        }
        
    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Razorpay payment
    // 1.first get the payment -> in it only add enrollment
    // 2. Update user in the context 
    // 2.make payout 
    const loadRazorPay= async()=> 
     {  console.log("Paid Enrollment");
        if(!paid) return;
         const  script=  document.createElement('script');
         document.body.appendChild(script);
         
         
         script.onload= async()=>{
            setLoading(true);
            try{
                // button press pr ye API CALL hogi jisme hume bs amount aur currency batani hai
                console.log(process.env.NEXT_PUBLIC_API);
                const {data}= await axios.get('/api/get-razorpay-key');
                const razorpayKey= data.key;
                const res = await axios.post(`/api/create-order`,{
                    amount: price +'00',
                    currency: "INR"
                });
                console.log("hello");
                //console.log(res.data);
                // ye hume ek order id dega (order ke andar hamari access key h isliye paise humare paas aaenge in production)
                const {amount, id:order_id, currency } = res.data;
                // handler is the function which is executed on successful payment
                const options={
                    key: razorpayKey,
                    amount: amount.toString(),
                    currency: currency,
                    name: user.name,
                    description: `Payment for ${name} `,
                    order_id: order_id,
                    handler:async function(response)
                    {
                        const result= await axios.post(`/api/pay-order/${_id}`,{
                            amount: amount,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        })
                        toast("Payment Successful");
                        updateuser();
                    },
                    theme:{
                        color: "#80c0f0"
                    }
    
                };
                setLoading(false);
                const paymentObject= new window.Razorpay(options);
                paymentObject.open();
    
            }
            catch(err)
            {
                alert(err);  
                setLoading(false);
            }
            
         }
         script.onerror= ()=>{
            alert("Failed to Load Razorpay , check your connection");
        };
        script.src="https://checkout.razorpay.com/v1/checkout.js";
    
    }
const updateuser= async()=>{
// update context
    try{
        const res= await axios.get('/api/get-userdata');
        dispatch({
            type: "LOGIN",
            payload: res.data,
        })
        payout();

    }
    catch(err)
    {
        console.log(err);
        toast("Some error occured updating your details. Contact Support");
    }
}   

const payout= async()=>{
    try{
        const payout_amount= price*10;
        const res= await axios.post('/api/payout',{
            amount: payout_amount,
            instructorid: instructor._id
        });
        toast("Payout Successful");
        setEnrolled(true);
    }
    catch(err)
    {
        console.log(err);
        toast("Payout failed");
    }
}
///////////////////////////////////////////////////////////////////////////////////

    return (
        <>
        <div className='jumbotron square text-light' style={{background:"linear-gradient(180deg, rgba(163,150,234,1) 0%, rgba(81,41,177,1) 44%, rgba(27,6,73,1) 100%)"}}>
        <div className='row'>
        <div className='col-md-8 mt-4 ps-4'>
        <h1 style={{fontFamily: "Merriweather"}} className='text-light font-weight-bold'>{name}</h1>
        <p className='text-light lead'><ReactMarkdown>{description}</ReactMarkdown></p>
        <Badge count={category} style={{backgroundColor: "rgba(163,150,234,0.4)"}}  className="pb-4 mr-2"/>
        <p>Created By: {instructor.name}</p>
        <p>Last updated: {new Date(updatedAt).toLocaleDateString()}</p>
        </div>
        <div className='col-md-4 mt-3 p-2 h-100 d-flex align-items-center justify-content-center'>
        <Card
        
        style={{width:"fit-content", backgroundColor:"rgba(255,255,255,0.2)" , zIndex:"2"}}
        cover=
            {
                <div>
                <img  onClick={()=>{if(lessons[0].free_preview){setModalvisible(true); setVideolink(lessons[0].videolink.Location);}}} src= {image.Location} alt={name} style={{width:"20rem"}} className="px-1 pt-1" />)
                </div>
            } >
         {
            paid && 
            <h3 className='text-light'>&#8377;{price}</h3>
        }
        {
            !paid &&
            <h3 className='text-light'>Free</h3>

        }
        {
            (enrolled) ? (<button className='btn  btn-lg col-12' style={{backgroundColor:"rgba(255,255,255,0.5)", color:"white" }}>Go to course</button>)
            :
            (<button className='btn  btn-lg col-12' onClick={paid?loadRazorPay: handleFreeEnrollment} style={{backgroundColor:"rgba(255,255,255,0.5)", color:"white" }}>{paid? "Buy Now": "Enroll Now"}</button>)
        }
        </Card>
        </div>
        </div>
        </div>
        <Modal title="Video Preview" visible={modalvisible} onCancel={()=>{setTimeout(()=>{setModalvisible(false);},100); setVideolink("");}} footer={null}>
        {modalvisible && <ReactPlayer url={videolink} playing={modalvisible} width="30rem" height="20rem" controls />}
        </Modal>
        <div className='m-4 mb-0' style={{fontSize:"1.75rem" ,fontFamily: "Raleway"}}>Lesson Details</div>
        <div className='m-4'>
        <List
                 itemLayout="vertical"
                dataSource={lessons}
                renderItem={(item, index) => (
                 <List.Item>
                {item.free_preview && <div className='text-end' style={{color:"green" , fontWeight:"500"}}>Free Preview</div>}
                 <List.Item.Meta
                 avatar={<Avatar shape='square'>{index+1}</Avatar>}
                title={item.title}
                description={item.content}
                onClick={()=>{if(videoplayidx ==index) setVideoplayidx(-1); else setVideoplayidx(index);}}
                />
                {
                    (videoplayidx== index && item.free_preview) &&
                    <div style={{width:"fit-content"}} className='ms-auto me-auto'><ReactPlayer url={item.videolink.Location} width="40rem" height="20rem" controls></ReactPlayer></div>

                }
                
      </List.Item>
      
    )}
  />
  </div>
        </>
    )
}

export async function getServerSideProps({query}){
    const {data}= await axios.get(`http://localhost:8000/api/course/${query.slug}`);
    return(
        {
            props:{
            course: data}
        });
    
}
export default SingleCourse;