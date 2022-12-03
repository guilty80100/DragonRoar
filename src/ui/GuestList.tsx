import React, { useRef } from "react";
import { motion, AnimateSharedLayout } from "framer-motion";
import { AiOutlinePlusCircle, AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { Badge, List, ListItem } from "@chakra-ui/layout";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
  useDisclosure,
  VisuallyHiddenInput,
  VStack,
} from "@chakra-ui/react";
import { useUpdateGuest, useGuestList, useIsHost } from "../hooks";
import { Timestamp } from "firebase/firestore";

const spring = { type: "spring", stiffness: 500, damping: 30 };

export default function GuestList() {
  return (
    <AnimateSharedLayout>
      <SimpleGrid columns={2} spacing={2} px={4} overflowX="auto">
        <GuestWhoBuzzedList />
        <GuestWhoDidNotBuzzList />
      </SimpleGrid>
    </AnimateSharedLayout>
  );
}

function GuestWhoBuzzedList() {
  const guestList = useGuestList();
  const isHost = useIsHost();
  const items = guestList
    .filter(({ buzzed }) => !!buzzed)
    .sort((a, b) => a.buzzed!.toMillis() - b.buzzed!.toMillis());

  return (
    <VStack alignItems="start" overflowX="auto">
      <Text color="teal.500" as="b">
        Buzzed
      </Text>
      <Divider />
      <List spacing={3} overflowX="auto" width="100%">
        {items.map(({ id, name, buzzed, score, blocked, lastAlive }, idx) => (
          <motion.div key={id} layoutId={id} transition={spring}>
            <ListItem>
              <User name={name} lastAlive={lastAlive}></User>
              <Box m={1} />
              <Text p={1} fontSize="sm" color="pink.500">
                {idx > 0
                  ? `+${buzzed?.toMillis()! - items[0]!.buzzed!.toMillis()}  ms`
                  : "🏆"}
              </Text>
              {isHost ? (
                <div>
                  <EditScore id={id} score={score} />
                  <DisablePlayer id={id} blocked={blocked} />
                </div>
              ): (
                <Text p={1} fontSize="sm" color="pink.500">
                  {score === 1 ? "1 point" : `${score} points`}
                </Text>
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>
    </VStack>
  );
}

function GuestWhoDidNotBuzzList() {
  const guestList = useGuestList();
  const items = guestList
    .filter(({ buzzed }) => !buzzed)
    .sort((a, b) => b.score - a.score);

  const isHost = useIsHost();

  return (
    <VStack alignItems="start" overflowX="auto">
      <Text color="teal.500" as="b">
        Not buzzed yet
      </Text>
      <Divider />
      <List spacing={3} overflowX="auto" width="100%">
        {items.map(({ id, name, score, blocked, lastAlive }) => (
          <motion.div key={id} layoutId={id} transition={spring}>
            <ListItem>
              <User name={name} lastAlive={lastAlive}></User>
              <Box m={1} />
              {isHost ? (
                <EditScore id={id} score={score} />
              ) : (
                <Text p={1} fontSize="sm" color="pink.500">
                  {score === 1 ? "1 point" : `${score} points`}
                </Text>
              )}
              {isHost ? (
                <DisablePlayer id={id} blocked={blocked} />
              ) : (
                <div>
                  <Badge p={1} fontSize="sm" colorScheme={blocked === true ? "red" : `green`} color={blocked === true ? "Red" : `Green`}>
                    {blocked === true ? "Buzzer Désactivé" : `Buzzer Activé`} {blocked === true ? <Icon as={AiFillCloseCircle} /> : <Icon as={AiFillCheckCircle} />}
                  </Badge>
                </div>
              )}
            </ListItem>
          </motion.div>
        ))}
      </List>
    </VStack>
  );
}

function User({ name, lastAlive }: { name: string, lastAlive: Timestamp | null }) {
  const TEN_SECONDS = 1000 * 10;
  let isOnline = process.env.REACT_APP_DISABLE_ONLINE_CHECK === "true" || (lastAlive && (new Date().getTime()  - lastAlive.toDate().getTime()) < TEN_SECONDS);

  return (
    <Badge p={1} fontSize="sm" colorScheme={ isOnline === true ? "green" : "red"} color={isOnline === true ? "Green" : "Red"}>
      {name} {isOnline === true ? <Icon as={AiFillCheckCircle} /> : <Icon as={AiFillCloseCircle} />}
    </Badge>
  );
}

function DisablePlayer({ id, blocked }: { id: string; blocked: boolean }) {
  const { mutate: updateGuest } = useUpdateGuest(id);

  const toggleDisable = async (e: any) => {
    e.preventDefault();
    const blocked = e.target.elements.blocked.checked!;
    updateGuest({ blocked });
  };

  return (
    <form onSubmit={toggleDisable}>
      <VisuallyHiddenInput name="blocked" checked={!blocked} readOnly={true}></VisuallyHiddenInput>
      <Button
        size="xs"
        type="submit"
        rightIcon={blocked === true ? <Icon as={AiFillCheckCircle} /> : <Icon as={AiFillCloseCircle} />}
        colorScheme={blocked === true ? "green" : "red"}
      >
        {blocked === true ? "Activer" : `Désactiver`}
      </Button>
    </form>
  );
}

function EditScore({ id, score }: { id: string; score: number }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const { mutate: updateGuest } = useUpdateGuest(id);

  const confirmEdit = async (e: any) => {
    e.preventDefault();
    const score = +new FormData(e.target).get("score")!;
    updateGuest({ score });
    onClose();
  };

  return (
    <Button
      size="xs"
      rightIcon={<Icon as={AiOutlinePlusCircle} />}
      colorScheme="pink"
      onClick={onOpen}
    >
      {score === 1 ? "1 point" : `${score} points`}
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={confirmEdit}>
            <ModalHeader>Edit Score</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>New score</FormLabel>
                <NumberInput name="score" defaultValue={score} ref={initialRef}>
                  <NumberInputField />
                </NumberInput>
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
