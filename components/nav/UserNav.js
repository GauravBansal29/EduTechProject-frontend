import Link from 'next/link'
import {useEffect, useState} from 'react'
import axios from 'axios'
const UserNav=()=>{

    const [current, setCurrent]= useState('');
    const [isinstructor, setIsinstructor]= useState(false);
    useEffect(()=>{
        const loadisInstructor= async()=>{
            try{
                const {data}= await axios.get('/api/current-instructor');
                if(data.ok) setIsinstructor(true);
            }
            catch(err)
            {
                console.log(err);
            }
        }
        loadisInstructor();
    },[])
    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname])

    return (
        <div className="nav flex-column nav-pills mt-2 ">
         <div className='pb-1'>
        <Link href="/user" >
            <a className={`nav-link ${current == '/user' && 'active'}`} style={{ color:(current !== '/user' ) && "#4B0082",  backgroundColor:(current == '/user' ) && "rgba(75,0,130,0.7)"}}>Dashboard</a>
        </Link>      
        </div>
        <div className='pb-1'>
        <Link href="/user/profile" >
            <a className={`nav-link ${current == '/user/profile' && 'active'}`} style={{color:(current !== '/user/profile' ) && "#4B0082" ,backgroundColor:(current == '/user/profile' ) && "rgba(75,0,130,0.7)"}}>Profile</a>
        </Link>      
        </div>
        <div className='pb-1'>
        <Link href="/user/payments" >
            <a className={`nav-link ${current == '/user/payments' && 'active'}`} style={{color:(current !== '/user/payments' ) && "#4B0082" ,backgroundColor:(current == '/user/payments' ) && "rgba(75,0,130,0.7)"}}>My Payments</a>
        </Link>      
        </div>
    
        </div>
    );
}

export default UserNav;