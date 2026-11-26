import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { db } from "./authService";
import { type Session } from "./types/Session";
import { type Player } from "./types/Player";


export const sessionRef = doc(db, "sessions", "main");


export async function createSession(): Promise<void> {
  const snap = await getDoc(sessionRef);
  if (snap.exists()) return;

  const newSession: Session = {
    id: "main",
    sessionName: "Hintavisa",
    status: "waiting",
    players: [],
    currentRound: 0,
    maxRounds: 3,
    currentProduct: null,
    secretPrice: null,
    correctPrice: null,
    winnerCodename: null,
  };

  await setDoc(sessionRef, newSession);
}


export async function joinSession(player: Player): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(sessionRef);
    const session = snap.data() as Session;

    if (session.status !== "waiting") return;
    if (session.players.length >= 4) return;
    if (session.players.some((p) => p.uid === player.uid)) return;

    transaction.update(sessionRef, {
      players: [...session.players, player],
    });
  });
}


export function subscribeToSession(
  callback: (session: Session | null) => void
) {
  return onSnapshot(sessionRef, (snap) => {
    callback(snap.exists() ? (snap.data() as Session) : null);
  });
}