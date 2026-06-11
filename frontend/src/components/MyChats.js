import React,{useEffect, useState} from 'react'
import {useToast,Box,Button, Stack,Text,Avatar, Spinner} from '@chakra-ui/react'
import {ChatState} from "../Context/ChatProvider"
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import ChatLoading from './ChatLoading'
import { getSender, getSenderFull } from '../config/ChatLogics'
import GroupChatModal from './miscellaneous/GroupChatModal'
import { newMessageReceived } from './SingleChat'

const MyChats = ({fetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState();
  const {selectedChat,setSelectedChat,user,chats,setChats}=ChatState();
  const toast=useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return <Box
    display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize={{base:"24px", md:"22px", lg:"30px"}} >
          My Chats
        </Text>
        <GroupChatModal>
        <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
            _active={{
                  transform: "translateY(0)",}}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats?(
          <Stack overflowY={"scroll"}>
            {chats.map((chat)=>(
              <Box display={"flex"} onClick={()=>{setSelectedChat(chat);}
              }
              cursor={"pointer"}
              bg={selectedChat===chat?"#ED8B2D":"#E8E8E8"}
              color={selectedChat === chat ? "white" : "black"}
              _hover={{bg:selectedChat===chat?"#ED8B2D":"rgba(225, 129, 37, 0.1)",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              px={3}
              py={2}
              borderRadius="lg"
              key={chat._id}
            >
              {!chat.isGroupChat && <Avatar size="sm" name={getSender(loggedUser,chat.users)} src={(getSenderFull(loggedUser,chat.users)).pic} mr={3}/>}
              <Text p={1} fontWeight={"medium"}>
                {!chat.isGroupChat?(getSender(loggedUser,chat.users)):(chat.chatName)}
              </Text>
            </Box>
            ))}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
  </Box>
}

export default MyChats
