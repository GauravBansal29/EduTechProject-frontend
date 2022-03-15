import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css'
import '../public/css/styles.css'
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import {Provider} from '../context'
import TopNav from '../components/TopNav'

// giving provider to global state so that anybody could use it inside our app

function MyApp({Component, pageProps}){
    
    return (<Provider>
    <TopNav/>
     <ToastContainer position="top-center" /> 
     <Component {...pageProps} /> 
     </Provider>);
   
}

export default MyApp;