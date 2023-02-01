// basically what we need to do is make the person instructor if we has successfully completed the payment process

import { useEffect, useContext } from "react"
import axios from 'axios'
import {SyncOutlined} from "@ant-design/icons"
import { Context } from "../../context"


const StripeCallBack= ()=>{
    const {state: {user}, dispatch} = useContext(Context);

    useEffect(()=>{
        if(user)
        {
            axios.post('https://backend-coursebay.onrender.com/api/get-account-status').then(res=>{

                dispatch({
                    type: "LOGIN",
                    payload: res.data,
                })
                localStorage.setItem("user", JSON.stringify(res.data));
                window.location.href= "/instructor";
            });
        }

    },[user]);

    return (
        <>
        <div></div>
        <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5"/>
        </>
    )


}
export default StripeCallBack;