import { doc, updateDoc } from "firebase/firestore";
import { useMutation } from "react-query";
import { useFirestore } from "reactfire";
import useGuest from "./useGuest";
import useRoom from "./useRoom";

export default function useAlive() {
  const firestore = useFirestore();
  const { id: roomId } = useRoom();
  const { id: guestId } = useGuest();
  const guestRef = doc(firestore, "rooms", roomId, "guests", guestId);
  return useMutation(() => updateDoc(guestRef, { lastAlive: new Date() }));
}
