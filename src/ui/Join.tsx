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
      <HStack px={5} h="58px" bg="red.500" shadow="base">
        <CloseButton
          color="white"
          size="lg"
          onClick={() => {
            window.location.href =
              window.location.origin + window.location.pathname;
          }}
        />
        <Heading color="white" size="md">
          Salle des dragons : {roomId}
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
              Cette salles des dragons n'existe pas !
            </AlertTitle>
            <AlertDescription>
              Reviens en arrière en rejoins en une autre !
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
          }}
        >
          Rugis !
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
      colorScheme="red"
      variant="ghost"
      rightIcon={<Icon as={AiFillEdit} />}
      onClick={onOpen}
    >
      Nom : {name}
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={confirmEdit}>
            <ModalHeader>Comment te nommes-tu, jeune dragon ?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Mon nom</FormLabel>
                <Input name="name" defaultValue={name} ref={initialRef} />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={onClose}>
                Annuler
              </Button>
              <Button colorScheme="red" type="submit">
                Confirmer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Button>
  );
}
