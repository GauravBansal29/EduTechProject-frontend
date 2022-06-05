import { useRouter } from "next/router";
import {useState, useEffect, useContext} from 'react'
import { toast } from "react-toastify";
import axios from 'axios'
import {Avatar, Checkbox, Menu} from 'antd'
import {DownOutlined, LeftOutlined, PlayCircleOutlined, RightOutlined, UpOutlined} from '@ant-design/icons'
import {Context} from '../../../context'
import ReactPlayer from 'react-player'
const CourseView= ()=>{
    const {state: {user}} = useContext(Context);
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
    const [complete , setComplete] =useState([]);
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
            setCoursediscussion(()=>{
                let m= data;
                m.sort((a,b)=>{return  new Date(b.createdAt) - new Date(a.createdAt)});
                return m;
            })
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

    useEffect(()=>{
        const getCompleteStatus= async ()=>{
            try{
                const res= await axios.get(`/api/completed/${course._id}`);
                console.log(res.data);
                setComplete(()=>{
                    let orrarray= res.data;
                     let returnarray =orrarray.map((item)=>{
                            return item.lesson;
                    })
                    console.log(returnarray);
                    return returnarray;
                });
            }
            catch(err)
            {   
                console.log(err);
                toast("Complete status loading unsuccessful");
            }
        }
        if(course && course._id) getCompleteStatus();
    }, [slug, course])

    const addDiscussion= async ()=>{
        try{
            const res= await axios.post('/api/adddiscussion',{
                courseid:course._id,
                lessonid: course.lessons[clicked]._id,
                value: newdiscussion
            });
            toast("Discussion added");
            setLessondiscussion(()=>{
            return [ {...res.data, user:{name:user.name}}, ...lessondiscussion ];
            });
            setCoursediscussion(()=>{
                return [ {...res.data, user:{name:user.name}} ,...coursediscussion];
            })
            setNewdiscussion('');
            
        }
        catch(err)
        {
            console.log(err);
            toast("Error loading discussions");
        }
    }

    const markAsComplete= async ()=>{
        try{

           // await new Promise(resolve => setTimeout(resolve, 5000));
            // if not included in array then mark as complete and add in state array 
            if( complete.indexOf(course.lessons[clicked]._id) == -1)
            { 
                const res1= await axios.post('/api/markascomplete', {
                    lessonid: course.lessons[clicked]._id,
                    courseid: course._id,
                });
                setComplete(()=>{
                    return [...complete, course.lessons[clicked]._id];
                })
            }
            else 
            {
                // if already there remove from state array and database
                const res2= await axios.post('/api/markasincomplete', {
                    lessonid: course.lessons[clicked]._id,
                    courseid: course._id
                });
                let idx= complete.indexOf(course.lessons[clicked]._id);
                setComplete(()=>{
                  return complete.filter((item, i)=> i!==idx);
                })
            }
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured in setting complete status");
        }
    }
    const markAsComplete2= async ()=>{
        try{

           // await new Promise(resolve => setTimeout(resolve, 5000));
            // if not included in array then mark as complete and add in state array 
            if( complete.indexOf(course.lessons[clicked]._id) == -1)
            { 
                const res1= await axios.post('/api/markascomplete', {
                    lessonid: course.lessons[clicked]._id,
                    courseid: course._id,
                });
                setComplete(()=>{
                    return [...complete, course.lessons[clicked]._id];
                })
            }
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured in setting complete status");
        }
    }
    return (
      enrolled? 
      (<div style={{overflowX:"hidden"}}>
        <div className="row">
        <div  className="p-0 mt-0" style={{width:"fit-content" ,height:'calc(100vh - 50px)', overflow:"scroll"}}>
        { course &&    
        <Menu
        defaultSelectedKeys={[clicked]}
        inlineCollapsed={collapse}
        style={{height:'calc(100vh - 50px)'}}>
            <div className="ms-2 pl-0" style={{ fontWeight:"700", borderBottom:"1px solid rgb(0,0,0,0.1)"}}>
            {!collapse && <h5 className="p-3 pb-0" style={{fontSize:"1.5rem" ,  textShadow:"0 1px 0 rgba(255, 255, 255, 0.4)" ,fontFamily:"Abel", fontWeight:"700"}}>{course.name}</h5>}
            </div>
            <div onClick={()=>{setCollapse(!collapse)}}>
            {
                collapse? <div style={{width:"fit-content", fontSize:"0.8rem", fontWeight:"bold"}} className="m-3 text-muted" >View<RightOutlined /></div>: <div className="ms-3 mt-2 p-2 pb-1" style={{fontSize:"1.1rem" ,fontWeight:"bold"}}>Course Content &nbsp;<LeftOutlined /></div>
            }
            </div>
            {
                course.lessons.map((lesson, index)=>{
                    return (
                <Item  style={{ paddingLeft: !collapse &&  "2rem", fontSize:"0.87rem"}} onClick={()=>{setClicked(index); setCollapse2(true); setCollapse3(true);}} key={index} icon={collapse? <Avatar>{index}</Avatar>:<PlayCircleOutlined />}>
            <span style={{paddingRight: (!collapse) && "3rem"}}>{lesson.title.substring(0,30)}</span>
               <span className="float-end"> <Checkbox disabled={clicked !== index } onChange={markAsComplete} checked={complete.indexOf(course.lessons[index]._id) !== -1}/> </span>
                </Item>

                    );
                })
            }
        </Menu>
        }
        </div>
        <div className="col p-0" style={{height:'calc(100vh - 50px)' , overflow:"scroll"}}>
        {clicked !=-1 ?
            <>
                        
            <div style={{height:"60vh"}}>
             <ReactPlayer
                url={course.lessons[clicked].videolink.Location}
                width="100%"
                height="100%"
                playing
                controls 
                onEnded={markAsComplete2}
            />
            </div>
            <div>
            <div>
            <h3 className="m-2 p-3" style={{fontSize:"1.4rem", fontFamily:"Montserrat", fontWeight:"700" , backgroundColor:"#eeeeee"}} onClick={()=>{setCollapse2(!collapse2)}}>Lesson Description {collapse2 ? <DownOutlined />: <UpOutlined />}</h3>
            {!collapse2 && <div className="m-2 ms-4" style={{fontWeight:500 ,fontSize:"1rem", fontFamily:"Lato"}}>{course.lessons[clicked].content}</div>}
            </div>
            <div>
            <h3 className="m-2 p-3" 
                style={{fontSize:"1.4rem", fontFamily:"Montserrat", fontWeight:"700", backgroundColor:"#eeeeee"}} 
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
                <div className="row ms-2">
                <input 
                className="col-md-8 m-2" 
                placeholder="Add something" 
                value={newdiscussion} 
                onChange={(e)=>{
                    setNewdiscussion(e.target.value)
                }} />
               {course && course.lessons && <button className="btn col-md-3 m-2" style={{color:"white" , fontWeight:"bold" ,backgroundColor:"rgba(163, 50, 234)"}}onClick={addDiscussion}>SUBMIT</button>}
               </div>
                {/* {JSON.stringify(lessondiscussion, null, 4)} */}
                <div>
                {lessondiscussion.map((item)=>{
                    return (
                        <div className="m-3 p-2 pe-5" style={{width:"fit-content" ,borderRadius:"10px" ,backgroundColor:"#eeeeee"}}>
                        <div style={{fontFamily:"Lato", fontWeight:"bold"}}>{item.user.name}</div>
                        <div style={{ marginTop:"0.5rem", marginLeft:"0.2rem" ,fontFamily:"Lato"}}>{item.value}</div>
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
         <>
         <div className="text-center mt-5" style={{ color:"#eeeeee" ,fontSize:"4rem"}} >
         <PlayCircleOutlined /> 
         <br></br>
         Click on the lesson to start learning
         </div>
         </>
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