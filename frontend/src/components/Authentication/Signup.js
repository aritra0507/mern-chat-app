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
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate=useNavigate();

  const handleClick = () => setShow(!show);
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dn5amiivo");
      fetch("https://api.cloudinary.com/v1_1/dn5amiivo/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
            console.log("Cloudinary Upload Success URL:", data.secure_url);
          setPic(data.secure_url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  const submitHandler = async () => {
    setLoading(true);
    if(!name||!email||!password||!confirmpassword){
      toast({
              title: "Please Fill all the Required Fields",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
      setLoading(false);
      return;
    }
    if(password!==confirmpassword){
      toast({
              title: "Passwords Do Not Match",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
            });
      setLoading(false);
      return;
    }

    try{
      const config={
        headers:{
          "Content-type":"application/json",
        },
      };

      const {data}=await axios.post("/api/user",{name,email,password,pic},config);
      toast({
              title: "Registration Successful",
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    }catch(error){
      toast({
              title: "Error Occured",
              description:error.response.data.message,
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
      <FormControl id="first-name" isRequired>
        <FormLabel color={"black"}>Name</FormLabel>
        <Input
          value={name}
          color={"black"}
          _hover={{borderColor:"#ED8B2D"}}
          focusBorderColor="#ED8B2D"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel color={"black"}>Email</FormLabel>
        <Input
          value={email}
          _hover={{borderColor:"#ED8B2D"}}
          focusBorderColor="#ED8B2D"
          color={"black"}
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel color={"black"}>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            _hover={{borderColor:"#ED8B2D"}}
            focusBorderColor="#ED8B2D"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            color={"black"}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              borderRadius={3}
              variant={"ghost"}
            >
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel color={"black"}>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={confirmpassword}
            color={"black"}
            _hover={{borderColor:"#ED8B2D"}}
            focusBorderColor="#ED8B2D"
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              borderRadius={3}
              variant={"ghost"}
            >
              {show ? <ViewOffIcon/> : <ViewIcon/>}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {pic && (
        <img 
          src={pic} 
          alt="Profile Preview" 
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", marginBottom: "10px" }} 
        />
      )}
      <FormControl id="pic">
        <FormLabel color={"black"}>Upload Your Picture</FormLabel>
        <Input
          type="file"
          color={"black"}
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        mt={3}
        bg="#ED8B2D"
        color="white"
        borderRadius="lg"
        boxShadow="sm"
        width="280px"
        transition="all 0.2s"
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
        {" "}
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
