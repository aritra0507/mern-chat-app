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
              title: "Please Fill all the Fields",
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
      localStorage.setItem("userInfor",JSON.stringify(data));
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
        <FormLabel color={"white"}>Name</FormLabel>
        <Input
          value={name}
          color={"white"}
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          focusBorderColor="pink.900"
        ></Input>
      </FormControl>
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
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              borderRadius={3}
              colorScheme="whiteAlpha"
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel color={"white"}>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={confirmpassword}
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            onChange={(e) => setConfirmpassword(e.target.value)}
            focusBorderColor="pink.900"
          ></Input>
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleClick}
              borderRadius={3}
              colorScheme="whiteAlpha"
            >
              {show ? "Hide" : "Show"}
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
        <FormLabel color={"white"}>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="purple"
        width="80%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        borderRadius={"lg"}
        isLoading={loading}
      >
        {" "}
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
