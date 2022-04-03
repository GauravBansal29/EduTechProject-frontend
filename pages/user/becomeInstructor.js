import axios from 'axios'
const becomeInstructor=  ()=>{
    const userOnboarding= async()=>{
        // backend will send us a link where we need to redirect user then the stripe will do its authentication and redirect back to us

        try{
            const res =await axios.post(`/api/makeinstructor`);
            window.location.href= res.data;
        }
        catch(err)
        {
            console.log("STRIPE REDIRECT UNSUCCESSFUL", err);
        }
    
    }
    return( <>
    <h1>Become an instructor</h1>
    <button onClick= {userOnboarding}>WE NEED YOUR BANK DETAILS FOR FUTURE PAYMENTS</button>
    </>);
}
export default becomeInstructor;