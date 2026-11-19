import { runTransaction } from "firebase/firestore";
import { db } from "./authService";
import { sessionRef } from "./gameSessionService";
import { type Session } from "./types/Session";
import { type Product } from "./types/Product";


async function fetchRandomProduct(): Promise<Product> {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  const products: Product[] = data.products;
  const randomIndex = Math.floor(Math.random() * products.length);
  return products[randomIndex];
}


function hidePrice(product: Product): Product {
  return { ...product, price: 0 };
}


export async function startGameIfPossible(session: Session): Promise<void> {
  if (session.players.length < 2) return;

  const product = await fetchRandomProduct();

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(sessionRef);
    const current = snap.data() as Session;

    if (current.status !== "waiting") return;

    transaction.update(sessionRef, {
      status: "playing",
      currentRound: 1,
      currentProduct: hidePrice(product),
      secretPrice: product.price,
      correctPrice: null,
      players: current.players.map((p) => ({ ...p, score: 0, guess: null })),
    });
  });
}


export async function submitGuess(uid: string, guess: number): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(sessionRef);
    const current = snap.data() as Session;

    if (current.status !== "playing") return;
    if (current.correctPrice !== null) return;

    const players = current.players.map((p) =>
      p.uid === uid && p.guess === null ? { ...p, guess } : p
    );

    const everyoneGuessed = players.every((p) => p.guess !== null);

    if (everyoneGuessed) {
      const price = current.secretPrice as number;

      const scoredPlayers = players.map((p) => ({
        ...p,
        score:
          p.score +
          Math.max(0, Math.round(100 - Math.abs((p.guess as number) - price))),
      }));

      transaction.update(sessionRef, {
        players: scoredPlayers,
        correctPrice: price,
      });
    } else {
      transaction.update(sessionRef, { players });
    }
  });
}


export async function nextRound(): Promise<void> {
  const product = await fetchRandomProduct();

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(sessionRef);
    const current = snap.data() as Session;

    if (current.correctPrice === null) return;

    
    if (current.currentRound >= current.maxRounds) {
      const winner = [...current.players].sort((a, b) => b.score - a.score)[0];
      transaction.update(sessionRef, {
        status: "finished",
        winnerCodename: winner.codename,
      });
      return;
    }

    transaction.update(sessionRef, {
      currentRound: current.currentRound + 1,
      currentProduct: hidePrice(product),
      secretPrice: product.price,
      correctPrice: null,
      players: current.players.map((p) => ({ ...p, guess: null })),
    });
  });
}


export async function clearPlayers(): Promise<void> {
  await runTransaction(db, async (transaction) => {
    transaction.update(sessionRef, {
      status: "waiting",
      players: [],
      currentRound: 0,
      currentProduct: null,
      secretPrice: null,
      correctPrice: null,
      winnerCodename: null,
    });
  });
}


export const resetGame = clearPlayers;