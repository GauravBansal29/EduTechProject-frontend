const express= require('express');
const next= require('next');
const {createProxyMiddleware}= require('http-proxy-middleware');

const dev= process.env.NODE_ENV !== 'production';
const app= next({dev});
const handle= app.getRequestHandler();

app.prepare().then(
    ()=>{
        const server= express();
        // apply proxy 
            server.use('/api', createProxyMiddleware({
                target: 'https://backend-coursebay.onrender.com',
                changeOrigin: true,
            }))
        
        server.all('*',(req,res)=>{
            return handle(req, res);
        })

        server.listen(3000,(err)=>{
            if(err) throw err;
            console.log("ready on localhost:8000");
        })
    })
    .catch(err=>{
        console.log(err);
    })