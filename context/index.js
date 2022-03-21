import {createContext, useReducer, useEffect} from "react"
import axios from "axios"
import {useRouter} from 'next/router'

// sending user data using Context and useReducer hook 

const initialState ={
    user: null
};

const Context= createContext();

// useReducer is multiple useStates on the base of action type 
// action will send data along with it in the form of payload
const rootReducer= (state, action)=>{
    switch(action.type)
    {
        case "LOGIN": 
        return {...state, user: action.payload};

        case "LOGOUT":
        return {...state, user:null};

        default:
            return state;

    }
}

const Provider= ({children})=>{
    const [state, dispatch] = useReducer(rootReducer ,initialState);
    const router =useRouter();


    // for storing the user back to context from local-storage on page refresh or redirect 
    useEffect(()=>{
        dispatch({type:"LOGIN", payload:JSON.parse(localStorage.getItem('user')) });
    },[]);

    // any status request from the backend without us sending anything is triggered here
    //generally when we send some request we see the response but in interceptors we can receive any status req sent by the backend
    //(HERE WE ARE USING FOR JWT EXPIRATION)
    axios.interceptors.response.use(
       function(response){
           // any status code in range of 2xx will trigger this 
           return response;  //just return we dont need to do anything 
       },
       function (error)
       {
            // any other status code will trigger this 
            let res= error.response;
            if(res.status === 401 && res.config && !res.config.__isRetryRequest)
            {
                return new Promise((resolve, reject)=>{
                    axios.get(`/api/logout`)
                    .then((data)=>{
                        dispatch({type:"LOGOUT"});
                        localStorage.removeItem('user');
                        router.push("/login");
                    })
                    .catch((err)=>{
                        console.log("AXIOS INTERCEPTOR ERROR",err);
                        reject(error);
                    })

                })
            }
           return  Promise.reject(error);
       }
    )
       useEffect(()=>{
            const getcsrfData= async ()=>{
                const {data}= await axios.get(`/api/csrf-token`);
                axios.defaults.headers["X-XSRF-Token"] = data.csrfToken;
                console.log(data.csrfToken);

            }
            getcsrfData();
       },[])
    return   <Context.Provider value={{state, dispatch}}>{children}</Context.Provider> ;
}
export {Provider, Context};