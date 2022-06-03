import {useState, useEffect, useRef} from 'react'
import {useRouter} from 'next/router'
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import axios from 'axios';
import {toast} from 'react-toastify'
import {Avatar, Button, Modal, List, Form, Tooltip,Switch} from 'antd'
import {EditOutlined, CheckOutlined, PlusOutlined, CloseOutlined, FileAddOutlined, FileDoneOutlined, FileExcelOutlined, FileExclamationOutlined} from '@ant-design/icons'
import ReactMarkdown from 'react-markdown'
import ReactPlayer from 'react-player'

const CourseView= ()=>{
    const [course, setCourse]= useState({});
    const [modalvisible , setModalvisible]= useState(false);
    const router= useRouter();
    const {slug}= router.query;  // to get the parameter of course
    const [videofilename, setVideofilename]=useState('Upload Video');
    const lessontitle= useRef();
    const lessondesc= useRef();
    const [lessonlink, setLessonlink]= useState({});  // actually contains all the details received from aws
    const [uploading, setUploading]= useState(false);
    const [uploaded , setUploaded] =useState(false);
    const [courselength, setCourselength]= useState('');
    const [videoplayidx, setVideoplayidx]= useState(-1);
    const [freepreview, setFreepreview]= useState(false);
    useEffect(()=>{
        // get the course details from the slug
        const getCourse= async ()=>{
            if(!router.isReady) return;
            try{
            const res= await axios.get(`/api/course/${slug}`);
            setCourse(res.data);
            console.log(course);
            setCourselength(res.data.lessons.length);
            console.log(res.data);
            }
            catch(err)
            {       
                console.log(err.response);
                toast("Something went wrong");
                router.push('/err');
            }

        }
        getCourse();
    },[router.isReady])

    const editoptions =()=>{
        router.push(`/instructor/course/edit/${slug}`);
    }
    const videouploadHandler=async (e)=>{
        // upload video to S3   
        const file= e.target.files[0];
        if(file) setVideofilename(file.name);
        const videoData = new FormData();
        videoData.append('video', file); // add the video data to this container
        try{
        setUploading(true);
        const {data}= await axios.post('/api/course/video-upload', videoData);
            setLessonlink(data);
            setUploading(false);
            setUploaded(true);
        }
        catch(err)
        {
            console.log(err);
            toast("Video upload unsuccessful");
            setUploading(false);
            setVideofilename("Upload Video");

        }
    }
    const removevideoHandler= async()=>{
        try{
            const res= await axios.post('/api/course/remove-video', {video:lessonlink});
            console.log(res.data);
            setVideofilename("Upload Video");
            setLessonlink({});
            setUploaded(false);
        }
        catch(err)
        {
            console.log(err);
            toast("An error occured. Try again");
        }
    }
    const addLessonHandler=async()=>{
        // form submission handler to add new lessons 
        console.log("Hello");
        setModalvisible(false);
        try{
            console.log(lessonlink);
            const res= await axios.post(`/api/course/lesson/${slug}`, {
                title: lessontitle.current.value,
                description: lessondesc.current.value ,
                videolink: lessonlink,
                free_preview: freepreview
            });
            console.log(lessondesc.current.value);
            setCourse(()=>{
                return {...course, lessons:[...course.lessons, {title: lessontitle.current.value , content: lessondesc.current.value , videolink: lessonlink}]}
            })
            setVideofilename("Upload Video");
            toast("Successfully added new lesson");
            
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured.Try again")
        }
        lessontitle.current.value="";
        lessondesc.current.value="";
        setLessonlink({});
        setUploaded(false);
        setCourselength((prev)=>{
            return prev+1;
        })
    }
    const handlePublish=async ()=>{
        try{
        const ans= window.confirm("Are you sure you want to publish the course? \nWarning: Once your course has users you wont be able to unpublish");
        if(!ans) return;
        const {data}=await axios.put(`/api/course/publish/${slug}`);
        setCourse(()=>{
            return {...course, published: true};
        })
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured");
            router.push('/err');
        }
    }
    const handleUnpublish= async ()=>{
        try{
        const ans= window.confirm("Are you sure you want to unpublish the course?");
        if(!ans) return;
        const {data}= await axios.put(`/api/course/unpublish/${slug}`);
        setCourse(()=>{
            return {...course, published: false};
        })
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured");
            router.push('/err');
        }
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
                    src= {course.image ? course.image.Location : "/course.png"}
                    shape= "square"
                    className='media-object'
                />
                </div>
                <div style={{width:"fit-content" ,maxWidth:"30rem" ,paddingTop:"0px"}} >
                 <h5 style={{fontFamily:"Lato" ,color:"rgba(147,112,219,1)"}}>{course.name}</h5>
                 <p style={{fontFamily:"Lato", marginTop:"-10px" ,fontWeight: "bold", color:"#cccccc"}}>{courselength} lessons</p>
                <p style={{fontFamily:"Lato", fontWeight:"500"}}><ReactMarkdown>{course.description}</ReactMarkdown></p>
                </div>
                <div className="col mr-0">
                <div className='row mb-3' onClick={editoptions} >
                <Tooltip placement="topRight" title="Edit" arrowPointAtCenter>
                <EditOutlined style={{fontSize:"1.2rem", color:"#999999"}}/>
                </Tooltip>
                </div>
                <div className='row' >
                {
                    (course.lessons && course.lessons.length< 5)? 
                    (
                    <Tooltip placement="bottomRight" title="Need atleast 4 lessons to publish" arrowPointAtCenter>
                    <FileExclamationOutlined style={{fontSize:"1.2rem", color:"#999999"}}/>
                    </Tooltip>
                    ):
                    (
                    course.published?
                    (
                        (course.users==0)?
                        (
                     <Tooltip placement="bottomRight" title="Unpublish Course" arrowPointAtCenter>
                    <FileExcelOutlined  onClick={handleUnpublish} style={{fontSize:"1.2rem", color:"#999999"}}/>
                    </Tooltip>

                        ):
                    (<Tooltip placement="bottomRight" title="Published (Course has users you cant unpublish now)" arrowPointAtCenter>
                    <FileDoneOutlined style={{fontSize:"1.2rem", color:"#999999"}}/>
                    </Tooltip>)
                    ):
                    (
                    <Tooltip placement="bottomRight" title="Publish" arrowPointAtCenter>
                    <FileAddOutlined onClick={handlePublish} style={{fontSize:"1.2rem", color:"#999999"}}/>
                    </Tooltip>
                    )
                    )
                }

                </div>
                </div>
                </div>
                <hr></hr>
                <div>
                <Button 
                    className={"col-md-6 offset-md-3 text-center"} 
                    shape="round" icon={<PlusOutlined />} 
                    style={{color:"white" ,fontWeight:"bold", backgroundColor:"rgba(147,112,219,0.9)"}}
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
                <div className='d-flex justify-content-center'>
                <label className='w-100 btn text-start mt-3' style={{backgroundColor: (videofilename == "Upload Video"? "#dddddd": "#aaaaaa"), fontWeight:"400",color: "#ffffff"}}>
                {videofilename}
                <input type="file" accept="video/*" hidden onChange={videouploadHandler} />
                </label>
                {
                    (uploaded) && 
                    <CloseOutlined className="d-flex justify-content-center pt-4 pointer" style={{fontSize:"1.5rem" ,color:"#aaaaaa" ,marginLeft:"0.5rem"}} onClick={removevideoHandler}/>
                }
                </div>
                <div className='mt-3 mb-2 ms-auto me-0 text-end' style={{fontWeight:"500" , color:"#555555"}}>Free Preview &nbsp; &nbsp;
                <Switch checked={freepreview} name="free-preview" onChange={(v)=>{setFreepreview(v);}}/>
                </div>
                <Button 
                    type="primary" 
                    className={"mt-2 col-md-6 offset-md-3 text-center"} 
                    shape="round" 
                    onClick= {addLessonHandler}
                    disabled={uploading}>
                {uploading? "Loading...": "Submit"}
                </Button>
                </form>
                </Modal>
                </div>
                <div className="row pb-5">
                <div className="col lesson-list">
                <h5>{courselength} lessons</h5>
                {/* <h5>{JSON.stringify(course.lessons, null, 2)}</h5>  */}
                <List
                 itemLayout="vertical"
                dataSource={course.lessons}
                renderItem={(item, index) => (
                 <List.Item>
                {item.free_preview && <div className='text-end' style={{color:"green" , fontWeight:"500"}}>Free</div>}
                 <List.Item.Meta
                 avatar={<Avatar shape='square'>{index+1}</Avatar>}
                title={item.title}
                description={item.content}
                onClick={()=>{if(videoplayidx ==index) setVideoplayidx(-1); else setVideoplayidx(index);}}
                />
                
                <div>
                {
                    (videoplayidx== index ) &&
                    <ReactPlayer url={item.videolink.Location} controls></ReactPlayer>

                }
                </div>
      </List.Item>
    )}
  />
                </div>
                </div>
                </>
    
              
        }
          </div>
        </InstructorRoute>
    );

}

export default CourseView;