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
        display="flex"
        justifyContent="center"
        p={3}
        bg={"whiteAlpha.100"}
        w="100%"
        m="40px 0 15px 0"
      >
        <Text fontSize={"4xl"} textAlign={"center"} fontFamily={"Work sans"} color={'black'}fontWeight={900}>Chat-ter</Text>
      </Box> 
      <Box  border="1px solid"
        borderColor="#ED8B2D"
        borderRadius="xl"
        boxShadow="0 8px 25px rgba(237,139,45,0.12)"
        bg="white" w="100%" p={4} >
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab _selected={{ color: 'white', bg: '#ED8B2D', borderRadius: 'full' }} color={'black'}>Log In</Tab>
            <Tab _selected={{ color: 'white', bg: '#ED8B2D', borderRadius: 'full' }} color={'black'}>Sign Up</Tab>
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
