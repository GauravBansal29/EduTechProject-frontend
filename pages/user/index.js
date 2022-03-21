import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {Context } from '../../context'

const Userindex=()=>{
    const {state} =useContext(Context);
    const {user} =state;
    console.log(user);
    const [hidden , setHidden] =useState(true);  // show only if jwt verified

    useEffect(()=>{
        
        const validate= async ()=>{

            try{
                console.log(process.env.NEXT_PUBLIC_API);
            const {data} = await axios.get(`/api/current-user`);
            setHidden(false);  // verified JWT
            }

            catch(err){
                console.log(err);
                setHidden(true); //JWT failed
            }

        }
         validate();
    },[])


    return (
        <>
        {            !hidden && 
                <h1>{JSON.stringify(user)}</h1>
        }
            
        </>
    );
}
export default Userindex;