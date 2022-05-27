import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import axios from 'axios';
import toast from 'react-toastify'
import {Avatar, Button, Modal} from 'antd'
import {EditOutlined, CheckOutlined, PlusOutlined} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
const CourseView= ()=>{

    const [course, setCourse]= useState('');
    const [modalvisible , setModalvisible]= useState(false);
    const router= useRouter();
    const {slug}= router.query;  // to get the parameter of course

    useEffect(()=>{
        // get the course details from the slug
        const getCourse= async ()=>{
            try{
            const res= await axios.get(`/api/course/${slug}`);
            setCourse(res.data);
            }
            catch(err)
            {       
                console.log(err.response);
                toast("Something went wrong");
                router.push('/err');
            }

        }
        getCourse();
    },[slug])
    const publish=()=>{

    }
    const editoptions =()=>{

    }
    return (
        <InstructorRoute>
          <div className="container-fluid pt-3">
        {
            course &&
            <>
                <div className="container-fluid pt-1 row" >
                <div style={{width:"fit-content"}}>
                <Avatar 
                    size={120}
                    src= {course.image ? course.image : "/course.png"}
                    shape= "square"
                    className='media-object'
                />
                </div>
                <div style={{width:"fit-content" ,maxWidth:"30rem" ,paddingTop:"0px"}} >
                 <h5 className="text-primary" >{course.name}</h5>
                 <p style={{marginTop:"-10px" ,fontWeight: "bold", color:"#cccccc"}}>{course.lessons && course.lessons.length} lessons</p>
                <p><ReactMarkdown>{course.description}</ReactMarkdown></p>
                </div>
                <div className="col mr-0">
                <div className='row mb-3' onclick={editoptions} >
                <EditOutlined style={{fontSize:"1.2rem", color:"#999999"}}/>
                </div>
                <div className='row' onclick={publish}>
                <CheckOutlined style={{fontSize:"1.2rem", color:"#999999"}} />
                </div>
                </div>
                </div>
                <hr></hr>
                <div>
                <Button 
                    type="primary" 
                    className={"col-md-6 offset-md-3 text-center"} 
                    shape="round" icon={<PlusOutlined />} 
                    style={{fontWeight:"bold"}}
                    onClick= {()=>{setModalvisible(true)}}>
                Add Lesson
                </Button>
                <Modal title="ADD LESSON" visible={modalvisible} onCancel={()=>{setModalvisible(false);}} onOk={()=>{setModalvisible(false)}}>
                hello world
                </Modal>
                </div>
                </>
    
              
        }
          </div>
        </InstructorRoute>
    );

}

export default CourseView;