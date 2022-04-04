import Link from 'next/link'

const UserNav=()=>{

    
    useEffect(()=>{
        process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname])

    return (
        <div className="nav flex-column nav-pills mt-2  ">
         <div className='pb-1'>
        <Link href="/user" >
            <a className={`nav-link ${current == '/user' && 'active'}`}>Dashboard</a>
        </Link>      
        </div>
        <div className='pb-1'>
        <Link href="/becomeInstructor" >
            <a className={`nav-link ${current == '/becomeInstructor' && 'active'}`}>Become Instructor</a>
        </Link>  
        </div>     
        </div>
    );
}

export default UserNav;