import {useState, useEffect} from "react"
import React from 'react';
import axios from 'axios'
import {useRouter} from 'next/router'
import CourseCard from "../components/Cards/CourseCard";
import {Carousel} from 'antd'
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
    const contentStyle= {
       
        height: '550px',
        width: '100%',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
        borderRadius: '10px'
      };
    let onChange=()=>{

    }
    return (
    <div >
    <Carousel afterChange={onChange} autoplay>
      <div>
        <img style={contentStyle} src="images/car1.png" alt="img1" />
      </div>
      <div>
      <img style={contentStyle} src="images/car2.png" alt="img2"/>
      </div>
      <div>
      <img style={contentStyle} src="images/car3.png" alt="img3"/>
      </div>
    </Carousel>
 
    <div className="container-fluid bg-light" style={{paddingTop:"40px"}} >
    
    <div style={{fontFamily:"Merriweather", fontSize:"2rem", fontWeight:"500"}} >Let's start learning</div>
    <div className="row mt-3" >
   { courses.map((course) => {
        return(<div key={course._id} className="col-md-4" >
       <CourseCard course={course} />
       </div>);

    }) }
    </div>
    </div>
    </div>
    );
    
}

export async function getServerSideProps(){
    const {data}= await axios.get(`https://backend-coursebay.onrender.com/api/courses`)
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