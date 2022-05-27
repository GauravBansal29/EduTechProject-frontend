import {useState, useEffect, useRef} from 'react'
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
    const [videofilename, setVideofilename]=useState('Upload Video');
    const lessontitle= useRef();
    const lessondesc= useRef();
    const lessonlink= useRef();

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
    const videouploadHandler=(e)=>{
        const file= e.target.files[0];
        setVideofilename(file.name);
    }
    const addLessonHandler=()=>{
        console.log("Hello");
        setModalvisible(false);
        lessontitle.current.value="";
        lessondesc.current.value="";
        lessonlink.current.value="";
        
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

                {/* lesson modal start */}
                <Modal title="ADD LESSON" visible={modalvisible} onCancel={()=>{setModalvisible(false);}} footer={null}>
                <form>
                <input 
                    type="text" 
                    className="form-control square" 
                    placeholder="title"
                    ref={lessontitle} 
                    autofocus
                    required />
                <textarea
                    placeholder='Description'
                    className='form-control mt-3'
                    rows="7"
                    cols="7"
                    ref={lessondesc}
                    autofocus
                    required />
                <label className='w-100 btn text-start mt-3' style={{color:"#ffffff" , fontWeight:"400",backgroundColor: "#dddddd"}}>
                {videofilename}
                <input type="file" accept="video/*" hidden onChange={videouploadHandler} />
                </label>
                <Button 
                    type="primary" 
                    className={"mt-2 col-md-6 offset-md-3 text-center"} 
                    shape="round" 
                    onClick= {addLessonHandler}>
                Submit
                </Button>
                </form>

                </Modal>
                </div>
                </>
    
              
        }
          </div>
        </InstructorRoute>
    );

}

export default CourseView;