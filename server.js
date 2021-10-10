const express=require('express')
const app=express()
const server=require('http').createServer(app)
const io=require('socket.io')(server)
const path=require('path')
const {v4: uuidv4}=require('uuid')
const { isObject } = require('util')

const port=5000

app.set('view engine','ejs')

app.use(express.static(path.join(__dirname,'/public')))

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`)
})
app.get('/:room',(req,res)=>{
    res.render('room',{roomId:req.params.room})
})



io.on('connection',(socket)=>{
    console.log('connected....')
    socket.on('join-room',(roomId,userId)=>{
        socket.join(roomId)
        socket.broadcast.to(roomId).emit('user-connected',userId)

        

        socket.on('disconnect',()=>{
            socket.broadcast.to(roomId).emit('user-disconnected',userId)

        })
    })

    socket.on('message',(sendingMessage)=>{
        //console.log(sendingMessage)
        socket.broadcast.emit('message',sendingMessage)
    })

})




server.listen(port,()=>{
    console.log(`listening on port ${port}`)
})

