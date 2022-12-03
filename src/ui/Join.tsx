import { AiFillEdit } from "react-icons/ai";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Center,
  CloseButton,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { useAlive, useBuzz, useGuest, useRoom, useUpdateGuest } from "../hooks";
import { GuestList } from ".";

const sound = new Audio("/audio/buzz.mp3");

export default function Join() {
  const { id: roomId, hostId } = useRoom();
  OnlineCheck();

  function OnlineCheck(){
      const { mutate: alive } = useAlive();
      useEffect(() => {
        if(process.env.REACT_APP_DISABLE_ONLINE_CHECK === "true"){
          alive();
          const interval = setInterval(() => {
            alive();
          }, 20000);
          return () => clearInterval(interval);
        }else{
          console.log('tracking disabled');
        }
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  }

  return (
    <Flex direction="column" h={window.innerHeight}>
      <HStack px={5} h="58px" bg="teal.500" shadow="base">
        <CloseButton
          color="white"
          size="lg"
          onClick={() => {
            window.location.href =
              window.location.origin + window.location.pathname;
          }}
        />
        <Heading color="white" size="md">
          Room number: {roomId}
        </Heading>
      </HStack>
      {!hostId ? (
        <>
          <Alert
            status="error"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <AlertIcon boxSize="40px" />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              This room number does not exist
            </AlertTitle>
            <AlertDescription>
              Try navigating back and use a different one
            </AlertDescription>
          </Alert>
        </>
      ) : (
        <>
          <Actions />
          <Box m={6} />
          <GuestList />
        </>
      )}
    </Flex>
  );
}

function Actions() {
  const { id: guestId, name, buzzed, blocked } = useGuest();
  const { mutate: buzz } = useBuzz();
  return (
    <>
      <HStack px={4} py={1} spacing="-5px">
        <EditName id={guestId} name={name} />
      </HStack>
      <Box m={4} />
      <Center>
        <Button
          colorScheme="red"
          borderRadius="50%"
          h="150px"
          w="150px"
          isDisabled={!!buzzed || !!blocked}
          onClick={() => {
            buzz();
            sound.play();
          }}
        >
          Buzz!
        </Button>
      </Center>
    </>
  );
}

function EditName({ id, name }: { id: string; name: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { mutate: updateGuest } = useUpdateGuest(id);

  const confirmEdit = async (e: any) => {
    e.preventDefault();
    const name = new FormData(e.target).get("name")!;
    updateGuest({ name });
    onClose();
  };

  return (
    <Button
      colorScheme="pink"
      variant="ghost"
      rightIcon={<Icon as={AiFillEdit} />}
      onClick={onOpen}
    >
      Name: {name}
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={confirmEdit}>
            <ModalHeader>Edit Name</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>New name</FormLabel>
                <Input name="name" defaultValue={name} ref={initialRef} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="teal" type="submit">
                Confirm
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Button>
  );
}
