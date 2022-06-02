import {useState , useEffect} from 'react'
import Link from 'next/link'


const InstructorNav= ()=>{

    const [current, setCurrent] = useState('');

    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname])


    return (
        <div className="nav flex-column nav-pills mt-2  ">
         <div className='pb-1'>
        <Link href="/instructor" >
            <a className={`nav-link ${current == '/instructor' && 'active'} `} style={{backgroundColor:(current == '/instructor')&&"rgba(75,0,130,0.7)"}}>Dashboard</a>
        </Link>     
        <Link href="/instructor/course/create" >
            <a className={`nav-link ${current == '/instructor/course/create' && 'active'} `} style={{backgroundColor:(current == '/instructor/course/create') && "rgba(75,0,130,0.7)"}}>Create Course</a>
        </Link>    
        </div>
        </div>     
    );
}
export default InstructorNav;