// import axios from "axios"
// // axios details will be taken with the help of form 

// const loadRazorPay=()=>{
//      const script= document.createElement('script');
//      script.src="https://checkout.razorpay.com/v1/checkout.js";
//      script.onerror= ()=>{
//          alert("Failed to Load Razorpay , check your connection");
//      };
//      script.onload= async()=>{
//         try{
//             // button press pr ye API CALL hogi jisme hume bs amount aur currency batani hai
//             const res = await axios.post('/create-order',{
//                 amount: orderAmount,
//                 currency: "INR"
//             })
//             // ye hume ek order id dega (order ke andar hamari access key h isliye paise humare paas aaenge in production)
//             const {amount, id:order_id, currency } = res.data;
//             // handler is the function which is executed on successful payment
//             const options={
//                 key: process.env.NEXT_PUBLIC_RAZORPAY_ACCESS_KEY,
//                 amount: amount.toString(),
//                 currency: currency,
//                 name: "customer name",
//                 description: "course details",
//                 order_id: order_id,
//                 handler:async function(response)
//                 {
//                     const result= await axios.post('/pay-order',{
//                         amount: amount,
//                         razorpayPaymentId: response.razorpay_payment_id,
//                         razorpayOrderId: response.razorpay_order_id,
//                         razorpaySignature: response.razorpay_signature,
//                     })
//                     alert(result.data.msg);
                    
//                 },
//                 prefill:{
//                     name: "customer name",
//                     email:"customer email",
//                     contact: 'customer contact',
//                 },
//                 theme:{
//                     color: "#80c0f0"
//                 }

//             };
//             const paymentObject= new window.Razorpay(options);
//             paymentObject.open();

//         }
//         catch(err)
//         {
//             alert(err);  
//         }
//         document.body.appendChild(script);
//      }

// }

// const Payment=()=>{

//     return <div>
//         <form onSubmit={loadRazorPay}>
//             <input type="Number"  placeholder="enter the amount"/>
//             <button type="submit">PAY</button>
//         </form>
//     </div>;
// }
// //export default Payment;
