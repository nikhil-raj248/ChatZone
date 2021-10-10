const socket=io('/')
const videoGrid=document.getElementById('video-grid')

const name="abcd"
const peers={}

const myPeer=new Peer(undefined,{
    host:'/',
    port:'3001'
})
myPeer.on('open',(id)=>{
    socket.emit('join-room',ROOM_ID,id)
})


const myVideo=document.createElement('video')
myVideo.muted=true;

navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
}).then(stream =>{
    
    addVideoStream(myVideo,stream)
    myPeer.on('call',call=>{
        call.answer(stream)
        
        const video=document.createElement('video')
        call.on('stream',userVideoStream=>{
            addVideoStream(video,userVideoStream)
        })
    })

    socket.on('user-connected',(userId)=>{
        //user is joining
        setTimeout(()=>{
            //user joined
            connectToNewUser(userId,stream)
        },1000)
        
    })

})



socket.on('user-disconnected',(userId)=>{
    //disconnected userId
    //console.log(userId)
    if(peers[userId])peers[userId].close()
})


function connectToNewUser(userId,stream){
    const call=myPeer.call(userId,stream)
    const video=document.createElement('video')
    call.on('stream',(userVideoStream)=>{
        addVideoStream(video,userVideoStream)
    })
    call.on('close',()=>{
        video.remove()
    })

    peers[userId]=call
}



//socket.on('user-connected',(userId)=>{
//    console.log('user connected '+userId)
//})



function addVideoStream(video,stream){
    video.srcObject=stream
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })

    videoGrid.appendChild(video)
}



/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////
/////////



let username
let textarea=document.querySelector('#textarea')
let messageArea=document.querySelector('.message_area')

do {
    username=prompt('enter your name : ')
} while (!username);


textarea.addEventListener('keyup',(e)=>{
    if(e.key === 'Enter'){
        sendMessage(e.target.value)
    }
})

function sendMessage(msg){
    let sendingMessage={
        user: username,
        message: msg.trim()
    }

    //append
    appendMessage(sendingMessage,'outgoing')

    textarea.value=''
    scrollToBottom()

    //send to server
    socket.emit('message',sendingMessage)

}

function appendMessage(sendingMessage,type){
    let mainDiv=document.createElement('div')
    let className=type;
    mainDiv.classList.add(className,'message')

    let markup=`
        <h4>${sendingMessage.user}</h4>
        <p>${sendingMessage.message}</p>
    `

    mainDiv.innerHTML=markup

    messageArea.appendChild(mainDiv)
}



////receive message 

socket.on('message',(msg)=>{
    //console.log(msg)
    appendMessage(msg,'incoming')
    scrollToBottom()
})



///scroll to bottom
function scrollToBottom(){
    messageArea.scrollTop=messageArea.scrollHeight;
}