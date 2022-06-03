import { useRouter } from "next/router";
import {useState, useEffect} from 'react'
import { toast } from "react-toastify";
import axios from 'axios'
import {Avatar, Menu} from 'antd'
import {DownOutlined, LeftOutlined, PlayCircleOutlined, RightOutlined, UpOutlined} from '@ant-design/icons'
import ReactPlayer from 'react-player'
const CourseView= ()=>{
    const {Item}=Menu;
    const router= useRouter();
    const {slug}= router.query;
    const [enrolled , setEnrolled]= useState(false);
    const [course, setCourse]= useState({lessons:[]});
    const [clicked ,setClicked] =useState(-1);
    const [collapse, setCollapse]=useState(false);
    const [collapse2, setCollapse2]= useState(true);
    const [collapse3, setCollapse3]= useState(true);
    const [coursediscussion, setCoursediscussion]= useState([]);
    const [lessondiscussion, setLessondiscussion]= useState([]);
    const [newdiscussion, setNewdiscussion] =useState('');

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

    useEffect(()=>{
        const loadCourse= async ()=>{
            try{
            const res= await axios.get(`/api/user/course/${slug}`);
            setCourse(res.data);
            if(res && res.data)
            {
            const {data}= await axios.get(`/api/course-discussions/${res.data._id}`);
            setCoursediscussion(data);
            }
            }
            catch(err)
            {
                console.log(err);
                toast(err);
            }
        }
        loadCourse();
    },[slug])

    const addDiscussion= async ()=>{
        try{
            const res= await axios.post('/api/adddiscussion',{
                courseid:course._id,
                lessonid: course.lessons[clicked]._id,
                value: newdiscussion
            });
            toast("Discussion added");
            setLessondiscussion(()=>{
                return [...lessondiscussion, res.data];
            });
            setCoursediscussion(()=>{
                return [...coursediscussion, res.data];
            })
            
        }
        catch(err)
        {
            console.log(err);
            toast("Error loading discussions");
        }
    }
    return (
      enrolled? 
      (<div>
        <div className="row">
        <div  className="p-0 ps-2" style={{width:"fit-content" ,height:'calc(100vh - 50px)'}}>
        { course && 
        <Menu
        defaultSelectedKeys={[clicked]}
        inlineCollapsed={collapse}
        style={{height:'calc(100vh - 50px)'}}>
       
           {!collapse && <h5 className="m-3" style={{fontFamily:"Montserrat", fontWeight:"600"}}>{course.name}</h5>}
            <div>
            
            <div onClick={()=>{setCollapse(!collapse)}} style={{ width:"fit-content" ,fontSize:"1rem"}}>
            {
                collapse? <div style={{width:"fit-content", fontSize:"0.8rem", fontWeight:"bold"}} className="m-3 text-muted" >View<RightOutlined /></div>: <div className="ms-3">Course Content &nbsp; &nbsp; &nbsp; &nbsp; <LeftOutlined /></div>
            }
            </div>
            </div>
            {
                course.lessons.map((lesson, index)=>{
                    return (
                <Item  style={{ paddingLeft: !collapse &&  "2rem" , paddingRight: !collapse && "5rem" , fontSize:"0.87rem"}} onClick={()=>{setClicked(index)}} key={index} icon={collapse? <Avatar>{index}</Avatar>:<PlayCircleOutlined />}>{lesson.title.substring(0,30)}</Item>

                    );
                })
            }
        </Menu>
        }
        </div>
        <div className="col p-0">
        {clicked !=-1 ?
            <>
            <div style={{height:"60vh"}}>
             <ReactPlayer
                url={course.lessons[clicked].videolink.Location}
                width="100%"
                height="100%"
                playing
                controls 
            />
            </div>
            <div>
            <div>
            <h3 className="m-2" style={{fontSize:"1.2rem", fontFamily:"Montserrat", fontWeight:"700"}} onClick={()=>{setCollapse2(!collapse2)}}>Lesson Description {collapse2 ? <DownOutlined />: <UpOutlined />}</h3>
            {!collapse2 && <div className="m-2" style={{fontSize:"1rem"}}>{course.lessons[clicked].content}</div>}
            </div>
            <div>
            <h3 className="m-2" 
                style={{fontSize:"1.2rem", fontFamily:"Montserrat", fontWeight:"700"}} 
                onClick={()=>
                {
                    setLessondiscussion(()=>{
                       let x= coursediscussion.filter((obj)=>{
                            return obj.lessonid === course.lessons[clicked]._id ;
                        })
                      return x;
                    })
                  setCollapse3(!collapse3);

                }}
            >
            Discussion{collapse3 ? <DownOutlined />: <UpOutlined />}
            </h3>
            {!collapse3 && <div className="m-2" style={{fontSize:"1rem"}}>
                <input 
                className="form-control" 
                placeholder="Add something" 
                value={newdiscussion} 
                onChange={(e)=>{
                    setNewdiscussion(e.target.value)
                }} />
               {course && course.lessons && <button className="btn btn-primary" onClick={addDiscussion}>SUBMIT</button>}
                {/* {JSON.stringify(lessondiscussion, null, 4)} */}
                <div>
                {lessondiscussion.map((item)=>{
                    return (
                        <div className="m-3 p-2" style={{width:"fit-content" ,borderRadius:"2px" ,backgroundColor:"#eeeeee"}}>
                        <div style={{fontFamily:"serif", fontWeight:"bold"}}>{item.user.name}</div>
                        <div style={{fontFamily:"Raleway"}}>{item.value}</div>
                        </div>
                    );
                })}
                </div>
                </div>}
            </div>
            </div>
            <div>

            </div>
            </>
            :
         <>Click on the lesson to start learning</>
         }
        </div>
        </div>





      </div>):
      (
        <div className="text-muted text-center" style={{fontSize:"3rem"}}>Enroll in the course to view it</div>
      )

    );

}

export default CourseView;