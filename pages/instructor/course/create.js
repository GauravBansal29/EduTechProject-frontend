import { useState } from "react";
import InstructorRoute from "../../../components/routes/InstructorRoute"
import {Select, Button, Upload, message} from 'antd'
import {SaveOutlined , LoadingOutlined, PlusOutlined, InfoCircleFilled} from '@ant-design/icons'
const CreateCourse =()=>{
    const {Option}= Select ;
    const [values, setValues] =useState({
        name:'',
        description: '',
        price:'100',
        loading:false,
        uploading: false,
        paid:false,
    })
    const [imgUrl, setImgUrl]= useState('');
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
    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Submit called");
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
        <form>
        <div className="form-group">
        <div className="form-row pt-3">
        <input type="text" name="name" className="form-control" placeholder="Course Name" value={values.name} onChange={handleChange} />
        </div> 
        <div className="form-row pt-3">
        <textarea name="description" className="form-control" placeholder="Description" value={values.description} onChange={handleChange} />
        </div>
        <div className="form-row pt-3">
        <div className="row">
        <div className="col-md-4">
            <Select value={values.paid} style={{width: '100%'}} size='large' onChange={()=>{setValues({...values , paid: !values.paid })}}>
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