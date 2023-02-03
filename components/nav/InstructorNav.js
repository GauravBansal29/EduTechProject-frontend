import {useState , useEffect} from 'react'
import Link from 'next/link'

//instructor nav
const InstructorNav= ()=>{

    const [current, setCurrent] = useState('');

    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname])


    return (
        <div className="nav flex-column nav-pills mt-2  ">
         <div className='pb-1'>
        <Link href="/instructor" >
            <a className={`nav-link ${current == '/instructor' && 'active'} `} style={{color:(current !== '/instructor' ) && "#4B0082", backgroundColor:(current == '/instructor')&&"rgba(75,0,130,0.7)"}}>Dashboard</a>
        </Link> 
        </div>
        <div className='pb-1'>  
        <Link href="/instructor/course/create" >
            <a className={`nav-link ${current == '/instructor/course/create' && 'active'} `} style={{color:(current !== '/instructor/course/create' ) && "#4B0082", backgroundColor:(current == '/instructor/course/create') && "rgba(75,0,130,0.7)"}}>Create Course</a>
        </Link>    
        </div>
        <div className='pb-1'>
        <Link href="/instructor/account" >
            <a className={`nav-link ${current == '/instructor/account' && 'active'} `} style={{color:(current !== '/instructor/account' ) && "#4B0082", backgroundColor:(current == '/instructor/account')&&"rgba(75,0,130,0.7)"}}>Account</a>
        </Link> 
        </div>
        </div>     
    );
}
export default InstructorNav;