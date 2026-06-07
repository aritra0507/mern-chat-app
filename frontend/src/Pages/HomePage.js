import React, { useEffect } from 'react';
import{Container,Box,Text,Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {
  const navigate=useNavigate();

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"));

    if(user) navigate("/chats");
  },[navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"whiteAlpha.100"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"4xl"} textAlign={"center"} fontFamily={"Work sans"} color={'white'}fontWeight={800}>Chat-ter</Text>
      </Box> 
      <Box bg="blackAlpha.500" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab _selected={{ color: 'white', bg: 'purple.500', borderRadius: 'full' }} color={'white'}>Log In</Tab>
            <Tab _selected={{ color: 'white', bg: 'purple.500', borderRadius: 'full' }} color={'white'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage
