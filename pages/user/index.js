import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {Context } from '../../context'
import UserRoute from '../../components/routes/UserRoute'
import { useRouter } from 'next/router'
import {toast} from "react-toastify"
import {Avatar, Empty} from 'antd'
import Link from 'next/link'
const UserIndex=()=>{
    const router= useRouter();
     const {state} =useContext(Context);
    const {user} =state;
    // console.log(user);
    const [courses, setCourses]= useState([]);
    const [progress, setProgress]= useState([]);
    const [myhover, setMyhover]= useState('');
    useEffect(()=>{

        const loadCourses=async()=>{
            try{
                const {data}= await axios.get(`https://backend-coursebay.onrender.com/api/user-courses`);
                setCourses(data);
            }
            catch(err)
            {
                console.log(err);
                router.push('/err');
                toast("Some error occured");
            }
        }
        loadCourses();
    },[])

    useEffect(()=>{

        const loadProgress= async()=>{
            
            
                axios.all(courses.map((course)=>axios.get(`https://backend-coursebay.onrender.com/api/completed/${course._id}`))).then(
                    (data)=>{
                        console.log(data);

                        let x= data.map((item)=>{
                            if(item.data && item.data.length >0)
                            return {length: item.data.length , courseid: item.data[0].course};
                        })
                        setProgress(x);
                        console.log(x);
                    //   data.map((item)=>{
                    //       console.log(item.data);
                    //     setProgress(()=>{
                    //         return [...progress, {length: item.data.length, courseid: item.data[0].course}];
                    //      });
                    },
                    (err)=>{
                        console.log(err);
                    }
                ); 
        }

     loadProgress();

    }, [courses])

    const getWidth=(courseid, givenlength)=>
    {
        //console.log(courseid, givenlength);
        const myprogress= progress.filter(item=>{ if(item && item.courseid) return (item.courseid == courseid)});
        //console.log(myprogress[0].length, givenlength);
        
        let x= (myprogress.length >0)?((myprogress[0].length/givenlength) *100):0;
        console.log(x);
        let a= x + "%"
        console.log(a);
        return a;
    }
    const getprogress= (courseid)=>{
        const myprogress= progress.filter(item=>{if(item && item.courseid) return (item.courseid == courseid)});
        return (myprogress.length >0)? (myprogress[0].length): 0;
    }
    return (
        <UserRoute>
            <div className='m-3'>
            <h2 style={{fontFamily:"Merriweather", fontWeight:"bold"}} className="mt-4" >User Dashboard</h2>
            {
                courses.length==0 && <div ><Empty /></div>
            }
            {/* <pre>{JSON.stringify(courses, null,4)}</pre> */}
            
               { progress.length!=0 && courses.length!=0 && courses.map((course)=>{
                    return (<Link href={`/user/course/${course.slug}`} className="pointer"><div key={course._id} onMouseOver={()=>{setMyhover(course._id);}} onMouseOut={()=>{setMyhover('');}} className="row mb-1" style={{ backgroundColor: (myhover==course._id)&& "rgba(208,208,255,0.3)" ,boxShadow:"0 3px 10px rgb(0,0, 0,0.2)"}}>
                    <div className='col-md-1 p-0'>
                    <Avatar 
                    size={80}
                    shape="square"
                    src={course.image? course.image.Location : "/course.png"}
                    />
                    </div>

                    <div className='col-md-4 ms-2'>
                    
                    <h5 className='mt-2'>{course.name}</h5>
                    
                    <p className='text-muted'>{course.instructor.name}</p>
                    </div>
                    <div className='col-md-6 mt-3 text-center'>
                    <div className="progress">
                     <div className="progress-bar" role="progressbar" style={{backgroundColor:"rgba(75,0,130,0.4)" ,width:getWidth(course._id, course.lessons.length) }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className='text-end text-muted ' style={{fontSize:"0.8rem" , fontWeight:"500"}}>
                    Completed {getprogress(course._id)} of {course.lessons.length} lessons
                    </div>
                    </div>

                    </div></Link>);
                })
    }
        </div>
        </UserRoute>
    );
}
export default UserIndex;