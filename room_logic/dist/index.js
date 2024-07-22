"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
let users = {};
let count = 0;
wss.on("connection", (ws, req) => {
    const wsId = count++;
    console.log(wsId);
    console.log("connected client");
    ws.on("message", (msg) => {
        const message = JSON.parse(msg.toString());
        if (message.type === 'join') {
            users[wsId] = {
                room: message.payload,
                ws
            };
            ws.send("joined");
            console.log("users: ", users);
        }
        else if (message.type === 'msg') {
            const roomId = users[wsId].room;
            Object.keys(users).forEach(element => {
                if (users[element].ws !== ws && roomId === users[element].room) {
                    users[element].ws.send(message.payload);
                }
            });
        }
    });
});
server.listen(3000, () => {
    console.log("web  Socket server started");
});
