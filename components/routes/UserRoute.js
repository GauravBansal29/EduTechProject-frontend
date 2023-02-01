import { useState, useEffect } from "react";
import axios from 'axios'
import { useRouter } from "next/router";
import UserNav from "../nav/UserNav";
// to verify user else it will redirect to login
const UserRoute= ({children})=>{
    const [hidden, setHidden] = useState(true);
    const router= useRouter();

    useEffect(()=>{
        
      const validate= async ()=>{

        try{
               console.log(process.env.NEXT_PUBLIC_API);
                const {data} = await axios.get(`https://backend-coursebay.onrender.com/api/current-user`);
                if(data.ok) setHidden(false);  // verified JWT
                else {
                    setHidden(true); //JWT failed
                      router.push('/login');
                }
            }
    
        catch(err){
                console.log(err);
                setHidden(true); //JWT failed
                router.push('/login');

            }
    
        }
        validate();
      
    },[])

    return (
            !hidden ? (
            <div className="container-fluid" style={{ height:'calc(100vh - 50px)'}}>
            <div className="row" style={{}}>
            <div className="col-md-2 bg-light" style={{boxShadow:" 0 3px 5px rgb(0 ,0, 0, 0.2)"}}>
            <UserNav />
            </div>
            <div className="col-md-10" style={{height:'calc(100vh - 50px)', overflow:"scroll"}}>
            {children}
            </div>
            </div>
            
            
            </div>
            )
            
            
            
            
            : (<></>)
    );

}

export default UserRoute;