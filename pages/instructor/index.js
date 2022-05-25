import { configConsumerProps } from "antd/lib/config-provider";
import { toast } from "react-toastify";
import InstructorRoute from "../../components/routes/InstructorRoute";
import {useRouter} from 'next/router'
import { useState, useEffect } from "react";
import axios from 'axios'
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
        <h1 className="jumbotron text-center square">INSTRUCTOR DASHBOARD</h1>
        <pre>{JSON.stringify(courses,null, 4)}</pre>
        </InstructorRoute>

    );
}
export default InstructorIndex;