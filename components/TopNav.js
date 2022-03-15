import {Menu} from "antd"
import Link from "next/link"
import {useEffect, useState, useContext} from "react"
import {toast} from "react-toastify"
import {useRouter} from "next/router"
import {Context} from "../context"
import axios from "axios"


const {Item} = Menu ;
const TopNav= ()=>{
    
    const {state, dispatch}= useContext(Context);
    const {user}= state;  //user is there in the current state 
    const router = useRouter();
    const [current,setCurrent]= useState(null);
    const onLogoutHandler= async()=>{
  
      try{
        dispatch({type:"LOGOUT"});
        localStorage.removeItem("user");
        const res= await axios.get(`${process.env.NEXT_PUBLIC_API}/logout`);
        toast(res.data);
        router.push("/login");
      }
      catch(err)
      {
        console.log(err);
    
      }
    
    }
    useEffect(()=>{
      process.browser && setCurrent(window.location.pathname);
    },[process.browser && window.location.pathname]);
    return (
      <Menu  mode="horizontal" selectedKeys={[current]}>
      <Item key="/" onClick={(e)=>{setCurrent(e.key)}}>
        <Link href="/"><a>Home</a></Link>
      </Item>
      {!user && 
      <>
      <Item key="/login" onClick={(e)=>{setCurrent(e.key)}}> 
      <Link href="/login"><a>Login</a></Link>
      </Item>
      <Item key="/register" onClick={(e)=>{setCurrent(e.key)}}>
      <Link href="/register"><a>Register</a></Link>
      </Item>
      </>}
      
     {user &&  <Item style={{ marginLeft: 'auto' }} onClick={onLogoutHandler}>
      Logout
      </Item>}
      </Menu>
      
  );

}

export default TopNav;