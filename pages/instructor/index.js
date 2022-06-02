import { configConsumerProps } from "antd/lib/config-provider";
import { toast } from "react-toastify";
import InstructorRoute from "../../components/routes/InstructorRoute";
import {useRouter} from 'next/router'
import { useState, useEffect } from "react";
import axios from 'axios'
import Link from 'next/link'
const InstructorIndex= ()=>{
    const [courses ,setCourses] = useState('');
    const router= useRouter();
    useEffect(()=>{
        const fetchCourses= async()=>{
            try{
                console.log("hello");
                const res= await axios.get('/api/instructor-courses');
                if(res.status == 200) 
                {
                    setCourses(res.data);
                }
            }
            catch(err)
            {
                console.log(err);
                toast("Unable to fetch courses");
                router.push('/err');  
            }
        }
        fetchCourses();
    },[])
    return(
        <InstructorRoute>
        <div>
        <h2 style={{fontFamily:"Merriweather", fontWeight:"bold"}} className="ms-5 mt-4">Instructor Dashboard</h2>
        
            <div className="container" style={{marginLeft:"2.5rem"}}>
            <div className="row align-items-stretch justify-content-start card-deck">
            {   
                courses && courses.map((item)=>{
                return (
                    <Link href={`/instructor/course/view/${item.slug}`} className= "pointer">
                <div className="card" style={{width: "25rem" ,margin:"0.5rem"}}>
                <img className ="card-img-top"  style={{marginTop:'1rem'}} src={item.image ? item.image.Location : "course.png"} alt="Card image cap" />
                <div className ="card-body">
                    <h5 className ="card-title">{item.name}</h5>
                    <a href="#" className ="btn btn-primary" style={{backgroundColor:`${item.published? "green": "red"}`, color:"white" , fontSize: '0.68rem' , fontWeight: 'bold' , padding:'0.1rem'}} >{item.published? "Published":"Not Published"}</a>
                    <a href="#" className ="btn btn-primary" style={{backgroundColor:"blue",  color:"white" , fontSize: '0.68rem' , fontWeight: 'bold' , padding:'0.1rem', marginLeft:'0.1rem'}} >{`${item.users.length} users`}</a>
                    <a href="#" className ="btn btn-primary" style={{backgroundColor:"orange",  color:"white" , fontSize: '0.68rem' , fontWeight: 'bold' , padding:'0.1rem' , marginLeft:'0.1rem'}} >{`${item.lessons.length} lessons`}</a>
                    <p className ="card-text">{item.description}</p>
                   
                </div>
                </div>
                </Link>
                );
                })
            }
            </div>
            </div>
            </div>
     {/* <pre>{JSON.stringify(courses,null, 4)}</pre> */}
        </InstructorRoute>

    );
}
export default InstructorIndex;