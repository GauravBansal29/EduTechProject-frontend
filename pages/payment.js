import axios from "axios"
import { useRef , useState} from "react";
// axios details will be taken with the help of form 


const Payment=()=>{
    const aamount= useRef();
    const [loading ,setLoading] = useState(false);


    const loadRazorPay= async(e)=> 
    {   e.preventDefault();

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
                    amount: aamount.current.value +'00',
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
                    name: "customer name",
                    description: "course details",
                    order_id: order_id,
                    handler:async function(response)
                    {
                        const result= await axios.post(`/api/pay-order`,{
                            amount: amount,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpaySignature: response.razorpay_signature,
                        })
                        alert(result.data.msg);
                        
                    },
                    prefill:{
                        name: "customer name",
                        email:"customer email",
                        contact: 'customer contact',
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

    return (<div>
        <form onSubmit={loadRazorPay}>
            <input type="text" ref={aamount}  placeholder="enter the amount"/>
            <button disabled={loading} type="submit">PAY</button>
        </form>
    </div>);
}
export default Payment;
