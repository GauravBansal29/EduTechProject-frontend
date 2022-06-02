import { useRouter } from "next/router";
import {useState, useEffect} from 'react'
import { toast } from "react-toastify";
import axios from 'axios'
const CourseView= ()=>{
    const router= useRouter();
    const {slug}= router.query;
    const [enrolled , setEnrolled]= useState(false);

    useEffect(()=>{
        const checkEnrollment= async ()=>{
            try{
                const {data}= await axios.get(`/api/check-enrollment/${slug}`);
                if(Object.keys(data.answer).length !== 0) setEnrolled(true);

            }
            catch(err)
            {
                console.log(err);
                toast("Some error occured");
                router.push("/err");
            }
        }
        checkEnrollment();
    },[slug])

    return (
      enrolled? 
      (<div>
          {slug}
      </div>):
      (
        <div className="text-muted text-center" style={{fontSize:"3rem"}}>Enroll in the course to view it</div>
      )

    );

}

export default CourseView;