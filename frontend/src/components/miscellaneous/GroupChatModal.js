import React,{useState} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  FormControl,
  Input
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';

const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {user,chats,setChats}=ChatState();

    const handleSearch=async (query)=>{
      setSearch(query);
      if(!query){
        setSearchResult([]);
        return;
      }

      try{
        setLoading(true);

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }

        const {data}=await axios.get(`/api/user?search=${query}`,config);
        setLoading(false);
        setSearchResult(data);
      }catch (error) {
      setLoading(false);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

    const handleSubmit=()=>{

    }

    return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
          >
           <FormControl>
            <Input placeHolder="Chat Name" mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
           </FormControl>
           <FormControl>
            <Input placeHolder="Add Users" mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
           </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button bg={"#ED8B2D"} color={"white"} _hover={{bg:"rgba(225, 129, 37, 0.1)",color:"black"}} onClick={handleSubmit}>
              Create Chat
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )

}

export default GroupChatModal
