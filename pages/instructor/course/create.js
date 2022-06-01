import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute"
import {Select, Button, Upload, message} from 'antd'
import {SaveOutlined , LoadingOutlined, PlusOutlined, InfoCircleFilled, ConsoleSqlOutlined, WindowsFilled} from '@ant-design/icons'
import axios from "axios";
import { toast } from "react-toastify";
import { Router, useRouter } from "next/router";
import Resizer from "react-image-file-resizer";
import { removeListener } from "process";

const CreateCourse =()=>{
    const {Option}= Select ;
    const [values, setValues] =useState({
        name:'',
        description: '',
        price:'100',
        loading:false,
        uploading: false,
        paid:false,
        category:''
    })
    const [imgUrl, setImgUrl]= useState('');
    const router = useRouter();

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
            const imgres = await axios.post('/api/image-upload',{image: imgUrl});
            console.log(imgres.data);
            if(imgres.status ===200) 
            {
                console.log(imgres.data.Location);
                //imgUrl to be changed to aws url i believe 
                try{
                    const res= await axios.post('/api/create-course', 
                    {
                        name: values.name , 
                        description: values.description ,
                        price: (values.paid ? values.price : 0),
                        image: imgres.data,
                        paid: values.paid,
                        category: values.category
                    });
                    if(res.status== 205){
                        toast("The title is already taken. Try Again");
                        setInterval(()=>{
                            router.reload(window.location.pathname);
                        }, 4000);
                        
                    }
                    if(res.status== 200) 
                    {
                        toast(<><div>Course created successfully</div><div>You can start adding lectures now</div></>);
                        
                        router.push('/instructor');
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

  

    return (
        <InstructorRoute>
        <h1 className="jumbotron text-center">Create Course</h1>
        <form onSubmit={onsubmitHandler}>
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
            <Select value={values.paid} style={{width: '100%'}} size='large' onChange={(value)=>{setValues({...values , paid:value })}}>
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
        <Button onClick={handleSubmit}  disabled={values.uploading || values.loading}  className="btn btn-primary" icon={<SaveOutlined/>} >
        {values.uploading? "Saving...." : "Save and Continue"}
        </Button>
        </div>
        </div>
        </div>
        </form>
        </InstructorRoute>
    )
}
export default CreateCourse;