import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useQuery } from "react-query";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { useRoom, useUser } from ".";

type Guest = {
  id: string;
  name: string;
  buzzed: Timestamp | null;
  blocked: boolean;
  lastAlive: Timestamp | null;
  score: number;
};

export default function useGuest() {
  const user = useUser();
  const { id: roomId } = useRoom();
  const firestore = useFirestore();
  const guestRef = doc(firestore, "rooms", roomId, "guests", user.uid);
  const { data: guest } = useFirestoreDocData(guestRef, { idField: "id" });
  const exists = !!guest?.name;
  useQuery(
    "guest",
    () => setDoc(guestRef, { name: randomMoniker(), buzzed: null, score: 0, blocked: false }),
    { enabled: !exists }
  );
  return guest as Guest;
}

function randomMoniker() {
  const dragon = dragons[(dragons.length * Math.random()) | 0];
  return `${dragon}`;
}

const dragons = [
  "Shenron",
  "Boutefeu Chinois",
  "Cornelongue Roumain",
  "Dent-de-vipère du Pérou",
  "Magyar à pointes",
  "Noir des Hébrides",
  "Norvégien à crête",
  "Suédois à museau court",
  "Vert gallois commun",
  "Opalœil des antipodes",
  "Pansdefer Ukrainien",
  "Norbert",
  "Cœur de givre",
  "Drogon",
  "Viserion",
  "Rhaegal",
  "Akulatraxas",
  "Gorgotha",
  "Klauth",
  "Glaurung",
  "Ancalagon",
  "Smaug",
  "Acnologia",
  "Ignir",
  "Konqi",
  "Grandiné",
  "Metalicana",
  "Jilkonis",
  "Atlas Flame",
  "Rivaia",
  "Scissor Runner",
  "Dragon de Pierre",
  "Dragon Sombre",
  "Belserion",
  "Draco",
  "Dracoloss",
  "Falkor",
  "Haku",
  "Mushu",
  "Kuunavang",
  "Rotscale",
  "Albax",
  "Shiny",
  "Alexstrasza",
  "Neltarion",
  "Nozdormu",
  "Malygos",
  "Ysera",
  "Primordius",
  "Jormag",
  "Zhaitan",
  "Kralkatorrik",
  "Mordremoth",
  "Brill",
  "Aurene",
  "Vlast",
  "Alduin",
  "Paarthurnax",
  "Odahviing",
  "Mirmulnir",
  "Sahloknir",
  "Vulthuryol",
  "Durnehviir",
  "Krosulah",
  "Sahrotaar",
  "Relonikiv",
  "Kruzikrel",
  "Viinturuth",
  "Nahagliiv",
  "Vuljotnaak",
  "Vermithrax",
  "Vermax",
  "Meleys",
  "Vhagar",
  "Seasmoke",
  "Caraxès",
  "Syrax",
  "Huanglong",
  "Tianlong",
  "Shenlong",
];
