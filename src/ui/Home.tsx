import {
  Flex,
  Box,
  Heading,
  Button,
  Text,
  VStack,
  Input,
  Spacer,
  FormControl,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { AiFillFire } from "react-icons/ai";
import React, { useEffect } from "react";
import { useCreateRoom } from "../hooks";

export default function Home() {
  const { mutate: createRoom, data: newRoom } = useCreateRoom();

  useEffect(() => {
    if (newRoom) {
      document.location.search = `?roomId=${newRoom}`;
    }
  }, [newRoom]);

  return (
    <Flex direction="column" h={window.innerHeight}>
      <HStack px={5} h="58px" bg="red.500" shadow="base">
        <Icon as={AiFillFire} w="30px" h="30px" color="white" />
        <Heading color="white" size="md">
          Dragon Roar
        </Heading>
      </HStack>
      <Box m={8} />
      <VStack spacing="48px">
        <Box
          rounded="md"
          w={[300, 400]}
          p={2}
          shadow="md"
          border="1px"
          borderColor="gainsboro"
        >
          <form>
            <VStack p={4} align="start" spacing={8}>
              <Heading size="sm">Rejoindre une salle des dragons</Heading>
              <Flex w="300px" align="center">
                <FormControl isRequired>
                  <Input
                    name="roomId"
                    variant="flushed"
                    placeholder="Numéro de la salle"
                    maxW="40"
                  />
                </FormControl>
                <Spacer />
                <Button variant="outline" colorScheme="red" type="submit">
                  Rejoindre
                </Button>
              </Flex>
            </VStack>
          </form>
        </Box>
        <Box
          rounded="md"
          w={[300, 400]}
          p={2}
          shadow="md"
          border="1px"
          borderColor="gainsboro"
        >
          <VStack p={4} align="start" spacing={8}>
            <Heading size="sm">Devenir le maître Dragon d'une salle</Heading>
            <Flex w="290px" align="center">
              <Text>Créer une salle des Dragons</Text>
              <Input name="roomId" type="hidden" value="" />
              <Spacer />
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => createRoom()}
              >
                Créer
              </Button>
            </Flex>
          </VStack>
        </Box>

        <Box
          rounded="md"
          w={[300, 400]}
          p={4}
          shadow="md"
          border="1px"
          borderColor="gainsboro"
        >
          <Text fontSize="sm" colorScheme="gray">
            💡 Astuce : Vous pouvez rejoindre la même salle, encore et encore, sans perdre vos points.
          </Text>
        </Box>
      </VStack>
    </Flex>
  );
}
