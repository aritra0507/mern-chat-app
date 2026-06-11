import {
  Input,
  VStack,
  FormLabel,
  FormControl,
  InputRightElement,
  InputGroup,
  Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import {useNavigate}from 'react-router-dom';
import { ViewOffIcon,ViewIcon } from "@chakra-ui/icons";


const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading,setLoading]=useState(false);

  const toast=useToast();
  const navigate=useNavigate();
  const handleClick = () => setShow(!show);
  const submitHandler = async() => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      //setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color={"white"}>
      <FormControl id="email" isRequired>
        <FormLabel color={"black"}>Email</FormLabel>
        <Input
          value={email}
          color={"black"}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          _hover={{borderColor:"#ED8B2D"}}
          focusBorderColor="#ED8B2D"
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color={"black"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            color="black"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            _hover={{borderColor:"#ED8B2D"}}
            focusBorderColor="#ED8B2D"
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} borderRadius={3} variant={"ghost"}>
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        mt={3}
        bg="#ED8B2D"
        color="white"
        borderRadius="lg"
        boxShadow="sm"
        transition="all 0.2s"
        width="280px"
        _hover={{
          bg: "#D97E21",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        _active={{
          transform: "translateY(0)",}}
        onClick={submitHandler}
        isLoading={loading}
      >
        Log In
      </Button>
      <Button
        mt={3}
        bg="#e64c29"
        color="white"
        borderRadius="lg"
        boxShadow="sm"
        transition="all 0.2s"
        width="280px"
        _hover={{
          bg: "#bf490e",
          transform: "translateY(-2px)",
          boxShadow: "lg",
        }}
        _active={{
          transform: "translateY(0)",}}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
