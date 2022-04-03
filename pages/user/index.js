import {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {Context } from '../../context'
import UserRoute from '../../components/routes/UserRoute'

const UserIndex=()=>{
    // const {state} =useContext(Context);
    // const {user} =state;
    // console.log(user);


    return (
        <UserRoute>
            <h1 className='jumbotron text-center' >USER DASHBOARD</h1>
        </UserRoute>
    );
}
export default UserIndex;