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
        title: "Please Fill all the Feilds",
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
        <FormLabel color={"white"}>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          focusBorderColor="pink.900"
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color={"white"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="pink.900"
          ></Input>
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} borderRadius={3} colorScheme="whiteAlpha">
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="purple"
        width="80%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        borderRadius={"lg"}
        isLoading={loading}
      >
        Log In
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="80%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        borderRadius={"lg"}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
