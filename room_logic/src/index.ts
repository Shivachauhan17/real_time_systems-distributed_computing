import express, { json } from 'express'
import {WebSocketServer} from 'ws'
import http from 'http'

const app=express()
const server=http.createServer(app)
const wss=new WebSocketServer({server})

let users:{[key:string]:{
    ws:any,
    room:string
}}={};
let  count=0;


wss.on("connection",(ws,req)=>{
    const wsId = count++;
    console.log(wsId)
    console.log("connected client")
    ws.on("message",(msg)=>{
        const message=JSON.parse(msg.toString())
        if (message.type==='join'){
            users[wsId]={
                room:message.payload,
                ws
            }
            ws.send("joined")
            console.log("users: ",users)
        }
        else if(message.type==='msg'){
            const roomId=users[wsId].room
            Object.keys(users).forEach(element => {
                if(users[element].ws!==ws && roomId===users[element].room){
                    users[element].ws.send(message.payload)
                }
            });
        }
    })
})

server.listen(3000,()=>{
    console.log("web  Socket server started")
})