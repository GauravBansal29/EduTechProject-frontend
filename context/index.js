import {createContext, useReducer, useEffect} from "react"
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
    // for storing the user back to context from local-storage on page refresh or redirect 
    useEffect(()=>{
        dispatch({type:"LOGIN", payload:JSON.parse(localStorage.getItem('user')) });
    },[]);
    return   <Context.Provider value={{state, dispatch}}>{children}</Context.Provider> ;
}
export {Provider, Context};