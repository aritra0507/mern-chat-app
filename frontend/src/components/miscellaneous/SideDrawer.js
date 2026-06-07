import {
  Tooltip,
  Box,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  position,
  Spinner,
  background
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";
import axios from 'axios';
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const [hasSearched,setHasSearched]=useState(false);
  const { user,setSelectedChat,chats,setChats } = ChatState();
  const navigate=useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate('/');
  }

  const toast=useToast();

  const handleSearch=async()=>{
    if(!search){
      setHasSearched(false);
      toast({
        title:"Please Enter something in Search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
      });
      return;
    }
      try{
        setLoading(true);

        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,

          }
        }
        const {data}=await axios.get(`/api/user?search=${search}`,config);
        
        setLoading(false);
        setSearchResult(data);
        setHasSearched(true);
      }catch(error){
        setLoading(false);
        toast({
          title:"Error Occured!",
          description:"Failed to Load the Search Results",
          status:"error",
          duration:1000,
          isClosable:true,
          position:"bottom-left"
        });
      }
    
  }

  const accessChat=async(userId)=>{
    try{
      setLoadingChat(true);

      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        }
      };

      const {data}=await axios.post("/api/chat",{userId},config);

      if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);
      
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    }catch(error){
      toast({
        title:"Error fetching the chat",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left"
      });
    }
  }

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        p={"5px 10px 5px 10px"}
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement="bottom-end" bg="green">
          <Button variant="ghost" onClick={onOpen} _hover={{bg:"rgba(225, 129, 37, 0.1)"}}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"3xl"} fontFamily={"work sans"} fontWeight={"extrabold"}>
          Chat-ter
        </Text>
        <div>
          <Menu>
            <Tooltip label="Notifications" hasArrow placement="bottom-end" bg="green">
              <MenuButton p={"1"} _hover={{bg:"rgba(225, 129, 37, 0.1)"}}>
                <BellIcon fontSize={"2xl"} margin={"1"} />
              </MenuButton>
            </Tooltip>
          </Menu>
          <Menu>
            <MenuButton as={Button} _hover={{bg:"rgba(225, 129, 37, 0.1)"}} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                _hover={{borderColor:"#ED8B2D"}}
                focusBorderColor="#ED8B2D"
                value={search}
                onChange={(e)=>{
                  const value=e.target.value;
                  setSearch(value);
                  if(!value){
                    setSearchResult([]);
                    setHasSearched(false);
                    return;
                  }
                }}
              />
              <Button _hover={{background:"rgba(225, 129, 37, 0.1)"}} onClick={handleSearch}>Go</Button>
            </Box>
            {loading?(
              <ChatLoading/>
            ):(
              hasSearched && searchResult && searchResult.length===0?(<Text p={2} color="gray.500" fontStyle="italic">No results found</Text>):
              (searchResult?.map((user)=>(
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />
              )))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"/>}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
