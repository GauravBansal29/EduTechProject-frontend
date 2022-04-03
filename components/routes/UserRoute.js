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
                const {data} = await axios.get(`/api/current-user`);
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
            <div className="container-fluid">
            <div className="row">
            <div className="col-md-2">
            <UserNav  />
            </div>
            <div className="col-md-9">
            {children}
            </div>
            </div>
            
            
            </div>
            )
            
            
            
            
            : (<></>)
    );

}

export default UserRoute;