
import InstructorRoute from '../../../../components/routes/InstructorRoute'
import { useState , useEffect} from "react";
import {Select, Button, Upload, message, Avatar,List, Tooltip, Modal, Switch} from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined, EditOutlined, CloseOutlined} from '@ant-design/icons'
import axios from "axios";
import { toast } from "react-toastify";
import { Router, useRouter } from "next/router";
import Link from 'next/link'
import slugify from 'slugify'


const EditCourse = ()=>{
    const [imgobj , setImgobj] = useState({});
    const router = useRouter();
    const {slug}= router.query;
    const {Option}= Select ;
    const [values, setValues] =useState({
        name:'',
        description: '',
        price:'100',
        loading:false,
        uploading: false,
        paid:false,
        category:'',
        lessons:[]
    });

    const [imgUrl, setImgUrl]= useState('');

    // states for lesson update 
    const [visible, setVisible]= useState(false);
    const [current, setCurrent] =useState({
        title:'',
        content:'',
        videolink:{},
        _id:'',
        slug:'',
        free_preview:false
    });
    const [videofilename, setVideofilename]= useState('Upload Video');
    const [uploading, setUploading]= useState(false);
    const [uploaded , setUploaded] =useState(false);
    const [listidx, setListidx]= useState(-1);

    useEffect(()=>{
        const loadstoredData= async()=>{
            if(!router.isReady) return;
            try{
            const {data}= await axios.get(`/api/course/${slug}`);
            setValues(()=>{
                return (
                {
                    name:data.name,
                    description: data.description,
                    price: data.price,
                    paid: data.paid,
                    category:data.category,
                    lessons: data.lessons
                }
                );
                
            });
            setImgUrl(data.image.Location);
            setImgobj(data.image);
            }
            catch(err)
            {
                console.log(err);
                toast("Something went wrong");
                router.push('/err');
            }


        }
        loadstoredData();
    }, [router.isReady])

    const onsubmitHandler= async (e)=>{
        e.preventDefault();
        //image upload 
        try{
            const result = await resizeImage(imgUrl, 720, 500);
            const imgres = await axios.post('/api/image-upload',{image: result});
            if(imgres.status ===200) 
            {
                //imgUrl to be changed to aws url i believe 
                try{
                    const res= await axios.post('/api/create-course', 
                    {
                        name: values.name , 
                        description: values.description ,
                        price: (values.paid ? values.price : 0),
                        image: result,
                        paid: values.paid
                    });

                    }
                catch(err)
                {
                    console.log(err);
                    toast("Form Submission unsuccessful");
                    router.push('/err');
                }
                
            }
        }
        catch(err)
        {
            console.log(err);
            toast("Form Submission unsuccessful");
            router.push('/err');
        }
    }

    const handleChange= (e)=>{
        setValues({...values , [e.target.name]: e.target.value})
    }
    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }
     function beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
              message.error('You can only upload JPG/PNG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
              message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
     }
    const handleImage= (info)=>{
        if(info.file.status === 'uploading')  
        {   setValues({...values , uploading:true}); 
            return;
        }

        if(info.file.status === 'done')
        {
            getBase64(info.file.originFileObj, imageUrl =>{
                setValues({...values, uploading:false});
                setImgUrl(imageUrl);
            });
               
        }

    }
    const handleSubmit=async (e)=>{
        e.preventDefault();
        //image upload 
        try{
            //const result = await resizeImage(imgUrl, 720, 500);
            /////////////////DELETE IMAGE FROM S3 IF CHANGE ELSE DONT CREATE NEW///////////////////////////////

            // if change in image url then we need to delete the previous image from s3 first and then add this one else it will act as bug to populate our database 
            let change= false;
            if(imgobj && (imgobj.Location != imgUrl))
            {
                // changes have been made to the image container
                const imgdel= await axios.post('/api/image-delete', {image:imgobj});
                change=true;

            }
            let imgres;
            if(change)
            {
                imgres = await axios.post('/api/image-upload',{image: imgUrl});
            }
            if(!change || imgres.status ===200) 
            {
                //imgUrl to be changed to aws url i believe 
                try{
                    const res= await axios.put(`/api/update-course/${slug}`, 
                    {
                        name: values.name , 
                        description: values.description ,
                        price: (values.paid ? values.price : 0),
                        image: change? imgres.data: imgobj,
                        lessons: values.lessons ,
                        paid: values.paid,
                        category:values.category
                    });
                    if(res.status== 205){
                        toast("The title is already taken. Try Again");
                        setInterval(()=>{
                            router.reload(window.location.pathname);
                        }, 4000);
                        
                    }
                    if(res.status== 200) 
                    {
                        toast("Course details updated successfully");
                        router.push(`/instructor/course/edit/${slugify(values.name.toLowerCase())}`)
                    }
                }
               catch(err)
               {
                console.log(err);
                toast("Form Submission unsuccessful");
                router.push('/err');
               }
                
            }
        }
        catch(err)
        {
            console.log(err);
            toast("Form Submission unsuccessful");
            router.push('/err');
        }
    }
    const uploadButton = (
        <div>
          {values.uploading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleDrag= (e, index)=>{
        console.log(index);
        e.dataTransfer.setData("itemIndex", index);
    }
   const handleDrop=async (e, index)=>{
       
       console.log(index);
       const movingItemIndex= e.dataTransfer.getData("itemIndex");
       const targetItemIndex= index;

       let alllessons=  values.lessons;
       let moveditem= alllessons[movingItemIndex];
       alllessons.splice(movingItemIndex, 1); // removed the moving item index
       alllessons.splice(targetItemIndex, 0, moveditem); // 0 removed and 1 pushed to this index
        console.log(alllessons);
       setValues(()=>{
           return {...values, lessons: [...alllessons]};
       });

       await axios.put(`/api/update-course-lessons/${slug}`, {lessons: values.lessons});
        toast("Lesson order updated");

        
   }

   const handleDelete= async(index)=>{
       console.log(index);
       const tindex= index;
       const ans= window.confirm("Do you want to delete this lesson?");
       if(!ans) return;
       let alllessons= values.lessons;
       let dellesson= alllessons[tindex];
       console.log(tindex);
       alllessons.splice(tindex, 1);
       setValues(()=>{
           return {...values , lessons:alllessons};
       });
       console.log(dellesson);
       try{
        await axios.put(`/api/update-course-lessons/${slug}`, {lessons: values.lessons}); // update lessons of course
        // we need to delete the video from aws and lesson from lesson modal
       await axios.post('/api/course/remove-video',{video: dellesson.videolink});

       await axios.delete(`/api/delete-lesson/${dellesson._id}`);

       }
       catch(err)
       {
        console.log(err);
        router.push('/err');
       }
   } 

   const removevideoHandler= async()=>{
    try{
        const res= await axios.post('/api/course/remove-video', {video:current.videolink});
        console.log(res.data);
        setVideofilename("Upload Video");
        setUploaded(false);
    }
    catch(err)
    {
        console.log(err);
        toast("An error occured. Try again");
    }
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
        setCurrent(()=>{
            return {...current, videolink: data};
        });
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

const updateLessonHandler=async()=>{
    // new need to first update the lesson and then update the lessonlist in the course
    try{
        const res= await axios.put(`/api/update-lesson/${current._id}`, {
            title: current.title,
            content: current.content,
            videolink: current.videolink,
            free_preview: current.free_preview,
            slug: slug
        });
        let alllessons= values.lessons;
        alllessons[listidx]= current;
        setValues(()=>{
            return {...values , lessons:alllessons};
        });
        await axios.put(`/api/update-course-lessons/${slug}`, {lessons: values.lessons}); // update lessons of course
        setVisible(false);
    }
    catch(err)
    {
        console.log(err);
        router.push('/err');
        toast("Some error occured");
    }

}
    return(
        <InstructorRoute>
        <Link href={`/instructor/course/view/${slug}`}><div className="text-end" style={{fontWeight:"400"}}><a> Go back to course view &#8594; </a></div></Link>
         <h6>Course Description</h6>
        <form>
        <div className="form-group">
        <div className="form-row pt-3">
        <input type="text" name="name" className="form-control" placeholder="Course Name" value={values.name} onChange={handleChange} />
        </div> 
        <div className="form-row pt-3">
        <textarea name="description" className="form-control" placeholder="Description" value={values.description} onChange={handleChange} />
        </div>
        <div className="form-row pt-3">
        <input type="text" name="category" className="form-control" placeholder="Course Category" value={values.category} onChange={handleChange} />
        </div> 
        <div className="form-row pt-3">
        <div className="row">
        <div className="col-md-4">
            <Select value={values.paid} style={{width: '100%'}} size='large' onChange={(value)=>{setValues({...values , paid: value})}}>
            <Option value={true}>Paid</Option>
            <Option value={false}>Free</Option>
            </Select>
        </div>
        { values.paid &&
            <div className="col-md-8">
            <input type="number" name="price" className="form-control" value={values.price} onChange={handleChange} />
            </div>  
         }
        </div>
        </div>

        <div className="form-row pt-3">
        <div className="col">
        <div className="form-group">
        <label>Image Preview</label>
        <Upload 
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload= {beforeUpload}
         onChange={handleImage}
        >
        {imgUrl ? <img src={imgUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
        </div>
        </div>
        </div>

        <div className="form-row pt-3">
        <div className="col">
        <Button onClick={handleSubmit}  disabled={values.uploading || values.loading}  className="btn btn-primary">
        {values.uploading? "Saving...." : "Update course details"}
        </Button>
        </div>
        </div>
        </div>
        </form>
        <br></br>
        <div className="row pb-5">
            <div className="col lesson-list">
            <h6>Lessons</h6>
            <List
             onDragOver= {e=>e.preventDefault()}
             itemLayout="horizontal"
             dataSource={values.lessons}
             renderItem={(item, index) => (
             <List.Item
               draggable
               onDragStart={e=>handleDrag(e, index)}
               onDrop={e=>handleDrop(e, index)}>
             <List.Item.Meta
                avatar={<Avatar shape='square'>{index+1}</Avatar>}
                title={<a href="https://ant.design">{item.title}</a>}
                description={item.content}
                />
            <Tooltip placement="topRight" title="Edit Lesson" arrowPointAtCenter><EditOutlined onClick={()=>{setVisible(true); setCurrent(item); setVideofilename(item.title); setUploaded(true); setListidx(index);}}  className="float-right me-4" style={{color:"#777777"}}/></Tooltip>
            <Tooltip placement="topRight" title="Delete Lesson" arrowPointAtCenter> <DeleteOutlined  onClick={()=>{handleDelete(index)}} className="float-right" style={{color:"#777777"}}/> </Tooltip>
              </List.Item>)} />
            </div>
            </div>
            <Modal 
                title="Update Lesson"
                centered
                visible={visible}
                onCancel={()=>{setVisible(false);}}
                footer={null}
                style={{padding:"1rem"}}
                >
                <form>
               
                <input 
                    type="text" 
                    className="form-control square" 
                    placeholder="title"
                    onChange={(e)=>{setCurrent({...current, title:e.target.value})}}
                    value={current.title} 
                    autofocus
                    required />
                <textarea
                    placeholder='Description'
                    className='form-control mt-3'
                    rows="7"
                    cols="7"
                    onChange={(e)=>{setCurrent({...current, content:e.target.value})}}
                    value={current.content}
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
                <Switch checked={current.free_preview} name="free-preview" onChange={(v)=>{setCurrent({...current, free_preview:v})}}/>
                </div>
                <Button 
                    type="primary" 
                    className={"mt-2 col-md-6 offset-md-3 text-center"} 
                    shape="round" 
                    onClick= {updateLessonHandler}
                    disabled={uploading}>
                {uploading? "Loading...": "Submit"}
                </Button>
                </form>
                </Modal>
        </InstructorRoute>

    );

}

export default EditCourse ;