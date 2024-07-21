import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'

const app=express()

const server=http.createServer(app)

const wss=new WebSocketServer({server})


wss.on('connection',async(ws)=>{
    console.log("connected")
    ws.on("message", (message) => {
        console.log("received: %s", message);
        ws.send(`Hello, you sent -> ${message}`);
    });
})

app.get("/health", (req, res) => {
    res.json({msg: "I am healthy"})
})

server.listen(3000,()=>{
    console.log("wen Socket server has been started")
});

