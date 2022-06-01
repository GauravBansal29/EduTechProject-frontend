import {useState, useEffect} from "react"
import axios from 'axios'
import {useRouter} from 'next/router'
import CourseCard from "../components/Cards/CourseCard";
const Index= ({courses})=>{
     const router= useRouter();
    // const [courses, setCourses]= useState([]);
    // useEffect(()=>{
    //     const fetchCourses = async()=>{
    //         try{
    //         const {data}= await axios.get('/api/courses');
    //         if(data) setCourses(data);
    //         }
    //         catch(err)
    //         {
    //             console.log(err);
    //             toast("Some error occured");
    //             router.push('/err');
                
    //         }

    //     }
    //     fetchCourses();
    //     console.log(courses);
    // },[router.isReady])
    return (
    <>
    <h1 className=" jumbotron text-center bg-primary linear-gradient text-white">Welcome to CourseBay</h1>
 
    <div className="container-fluid">
    <div className="row">
   { courses.map((course) => {
        return(<div key={course._id} className="col-md-4" >
       <CourseCard course={course} />
       </div>);

    }) }
    </div>
    </div>
    </>
    );
    
}

export async function getServerSideProps(){
    const {data}= await axios.get(`http://localhost:8000/api/courses`)
    return (
        {
            props:
            {
                courses:data,
            }
        }
    )
}
export default Index;