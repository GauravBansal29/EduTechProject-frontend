import UserRoute from "../../components/routes/UserRoute";
import {useState, useEffect} from 'react'
import axios from 'axios'
import { useRouter } from "next/router";
import {toast} from 'react-toastify'
import Link from 'next/link'

const UserProfile= ()=>{
    const [name,setName]= useState('');
    const [contact,setContact]= useState('');
    const [interest, setInterest]=useState('');
    const [email, setEmail]=useState('abc@gmail.com');
    const router= useRouter();
    useEffect(()=>{
        const fetchUser = async()=>{
            try{
         const {data} =await axios.get('/api/get-userdata');
                setName(data.name);
                setContact(data.contact);
                setEmail(data.email);
               if(data.interest) setInterest(data.interest);
            }
            catch(err)
            {
                console.log(err);
                router.push('/err');
            }

        }

        fetchUser();
    },[])

    const updateUser= async(e)=>{
        try{
            e.preventDefault();
            const {data}= await axios.post('/api/update-user', {
                name:name,
                contact:contact,
                interest: interest
            });
            toast("Updated Successfully")
            
        }
        catch(err)
        {
            console.log(err);
            toast("Some error occured try again");
        }
    }
    return (
        <UserRoute>
        <div className="mx-3">
        <h3 className="mt-4 ms-2" style={{fontSize:"2rem" , fontFamily:"Merriweather", fontWeight:"bold"}}>User Profile</h3>
        <form>
        <input placeholder="Update your name" value={name} className="mt-3 mb-3 form-control" onChange={(e)=>{setName(e.target.value)}} />
        <input placeholder="Update your contact details" value={contact} className="mb-3 form-control" onChange={(e)=>{setContact(e.target.value)}} />
        <textarea placeholder="Your interests" value={interest} className="mb-3 form-control" onChange={(e)=>{setInterest(e.target.value)}}/>
        <input disabled value={email} className="mb-3 form-control" onChange={(e)=>{setEmail(e.target.value)}} />
        
        <button className="btn mb-3 mt-2" style={{backgroundColor:"rgba(81, 41, 177, 0.9)", color:"white", fontWeight:"500"}} onClick={updateUser}>Update Info</button>
        
        <div  className="p-2 mt-3" style={{borderRadius:"5px" ,backgroundColor:"#eeeeee" ,fontSize:"1rem" , fontFamily:"Merriweather", fontWeight:"bold"}}>
        Do you want to change your password ? <Link href='/update-password'><button className="btn ms-4 px-3" style={{backgroundColor:"rgba(81, 41, 177, 0.9)", color:"white", fontWeight:"500"}} >Change Password</button></Link>
        </div>
        
        </form>
        </div>
        </UserRoute>
    );
}

export default UserProfile;