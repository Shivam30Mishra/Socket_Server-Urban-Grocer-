import express from 'express'
import http    from 'http'
import dotenv  from 'dotenv'
import { Server } from 'socket.io'
import axios from 'axios'
import { type } from 'os'

dotenv.config()

const app = express()

const port = process.env.PORT || 5000

const server = http.createServer(app)

app.use(express.json())

const io = new Server(server,{
  cors: {
    origin : process.env.NEXT_BASE_URL
  }
})

io.on("connection", (socket) => {
  console.log(`a user connected ${socket.id}`)

  socket.on("identity", async (id) => {
    console.log(id)
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`,{
      userId : id,
      socketId : socket.id
    })
  })

  socket.on("updateLocation", async ({ userId, latitude, longitude }) => {
    try {
      const location = {
        type: "Point",
        coordinates: [longitude, latitude],
      }

      await axios.post(
        `${process.env.NEXT_BASE_URL}/api/socket/update-location`,
        { userId, location }
      )

      io.emit("update-deliveryBoy-location",{ userId, location })

    } catch (err) {
      console.error("updateLocation failed:", err.message)
    }
  })

  socket.on("join-room",(roomId)=>{
    console.log("Join room with room id",roomId)
    socket.join(roomId)
  })

  socket.on("send-message",async (message)=>{
    console.log("New message",message)
    await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
    io.to(message.roomId).emit("send-message",message)
  })

  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`)
  })
})

app.post("/notify",(req,res)=>{
  const { event,data,socketId } = req.body
  if(socketId){
    io.to(socketId).emit(event,data)
  }else{
    io.emit(event,data)
  }
  return res.status(200).json({
    success : true,
    message : "Notification sent successfully"
  })
})

server.listen(port, () => console.log(`Server running on port ${port}`))