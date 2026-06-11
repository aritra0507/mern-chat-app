import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import {Box,Spinner,Text,FormControl,Input, useToast,Avatar} from "@chakra-ui/react";
import { IconButton,ArrowBackIcon } from '@chakra-ui/icons';
import {getSender,getSenderFull} from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal"
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "../styles.css";
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";

const ENDPOINT="https://chat-ter.onrender.com";
var socket,selectedChatCompare;

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [typingUser, setTypingUser] = useState(null);
    const toast=useToast();

    const defaultOptions={
        loop:true,
        autoplay:true,
        animationData:animationData,
        rendererSettings:{
            preserveAspectRatio:"xMidYMid slice"
        },
    };

    const fetchMessages=async()=>{
        if(!selectedChat) return;

        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                    }
            }
            setLoading(true);

            const {data}=await axios.get(`/api/message/${selectedChat._id}`,config)
            setMessages(data);
            setLoading(false);

            socket.emit('join chat',selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };

    useEffect(()=>{
        socket=io(ENDPOINT);
        socket.emit("setup",user);
        socket.on("connected",()=>setSocketConnected(true));
        socket.on("typing",(user)=>setTypingUser(user));
        socket.on("stop typing",()=>setTypingUser(null));
    },[]);

    useEffect(()=>{
        fetchMessages();
        
        selectedChatCompare=selectedChat;
    },[selectedChat]);

    useEffect(()=>{
        socket.on('message received',(newMessageReceived)=>{
            if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id){
                //give notification
                if(!notification.includes(newMessageReceived)){
                    setNotification([newMessageReceived,...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessages([...messages,newMessageReceived]);
            }
        });
    })

    const sendMessage=async(event)=>{
        if(event.key==="Enter" && newMessage){
            socket.emit('stop typing',selectedChat._id);
            try {
                const config={
                headers:{
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`,
                    }
                }
                setNewMessage("");
                const {data}=await axios.post('/api/message',{
                    content:newMessage,
                    chatId:selectedChat._id,
                },config)
                socket.emit('new message',data);
                setMessages([...messages,data]);
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler=(e)=>{setNewMessage(e.target.value)
        //Typing Indicator Logic
        if(!socketConnected) return;

        if(!typing){
            setTyping(true);
            socket.emit('typing',{
                room:selectedChat._id,
                user:{
                    _id:user._id,
                    name:user.name,
                    pic:user.pic
                }
            });
        }

        let lastTypingTime=new Date().getTime();
        var timerLength=3000;
        setTimeout(()=>{
            var timeNow=new Date().getTime();
            var timeDiff=timeNow-lastTypingTime;

            if(timeDiff>=timerLength && typing){
                socket.emit("stop typing",selectedChat._id);
                setTyping(false);
            }
        },timerLength);
    };

  return (
    <>{
        selectedChat?(
            <>
                <Box
                    fontSize={{ base: "28px", md: "30px" }}
                    pb={3}
                    px={2}
                    w="100%"
                    fontFamily="Work sans"
                    display="flex"
                    justifyContent={{ base: "space-between" }}
                    alignItems="center"
                >
                    <IconButton
                        display={{ base: "flex", md: "none" }}
                        icon={<ArrowBackIcon />}
                        onClick={() => setSelectedChat("")}
                        mr={3}
                    />
                    {!selectedChat.isGroupChat?(
                        <Box display={"flex"} justifyContent={"space-between"}
                        w={"100%"}>
                            {getSender(user,selectedChat.users)}
                            <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                        </Box>
                    ):(
                        <Box display={"flex"} justifyContent={"space-between"}
                        w={"100%"}>
                            {selectedChat.chatName.toUpperCase()}
                            <UpdateGroupChatModal
                                fetchMessages={fetchMessages}
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                            />
                        </Box>
                    )}
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    p={3}
                    bg="#E8E8E8"
                    w="100%"
                    h="100%"
                    borderRadius="lg"
                    overflowY="hidden">
                    {loading?(<Spinner
                     size="xl"
                     w={20}
                     h={20}
                     alignSelf={"center"}
                     margin="auto"/>):
                     (<div className='messages'>
                        <ScrollableChat messages={messages}></ScrollableChat>
                    </div>)}
                    <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                        {typingUser?<Box display="flex" alignItems={"center"}>{selectedChat.isGroupChat && <Avatar size="sm" src={typingUser?.pic} name={typingUser?.name} mr={2}/>}<Lottie
                            options={defaultOptions}
                            width={70}
                            style={{marginBottom:15,marginLeft:0}}
                        /></Box>:<></>}
                        <Input
                            variant="filled"
                            bg="#E0E0E0"
                            placeholder="Enter a message..."
                            _hover={{borderColor:"#ED8B2D"}}
                            focusBorderColor="#ED8B2D"
                            value={newMessage}
                            onChange={typingHandler}
                        />
                    </FormControl>
                </Box>
            </>
        ):(
            <Box display="flex" alignItems={"center"} justifyContent={"center"} h={"100%"}>
                <Text fontSize="3xl" pb={3} fontFamily="work sans">
                    Click on a user to start chatting
                </Text>
            </Box>
        )
    }

    </>
  )
}

export default SingleChat
