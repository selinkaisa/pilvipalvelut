import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, logout } from './authService'
import LoginForm from './LoginForm'
import { QuizForm } from './components/QuizForm'
import {
  createSession,
  joinSession,
  subscribeToSession,
} from './gameSessionService'
import {
  startGameIfPossible,
  submitGuess,
  nextRound,
  resetGame,
  clearPlayers,
} from './gameController'
import { type Session } from './types/Session'
import './App.css'

function generateCodename() {
  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"]
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"]
  const number = Math.floor(Math.random() * 3000)

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const animal = animals[Math.floor(Math.random() * animals.length)]

  return `${adj}${animal}${number}`
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [codename, setCodename] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const storageKey = `codename_${firebaseUser.uid}`
        const cachedName = localStorage.getItem(storageKey)

        if (cachedName) {
          setCodename(cachedName)
        } else {
          const newName = generateCodename()
          localStorage.setItem(storageKey, newName)
          setCodename(newName)
        }
      } else {
        setCodename(null)
        setSession(null)
      }

      setAuthLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user || !codename) return

    createSession()
      .then(() =>
        joinSession({ uid: user.uid, codename, score: 0, guess: null })
      )
      .catch((err) => console.error("Peliin liittyminen epäonnistui:", err))
  }, [user, codename])

  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToSession(setSession)
    return () => unsubscribe()
  }, [user])

  async function handleStartGame() {
    if (!session) return
    try {
      await startGameIfPossible(session)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSubmitGuess(guess: number) {
    if (!user) return
    try {
      await submitGuess(user.uid, guess)
    } catch (err) {
      console.error(err)
    }
  }

  async function handleNextRound() {
    try {
      await nextRound()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleResetGame() {
    try {
      await resetGame()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleClearPlayers() {
    if (!confirm("Poistetaanko kaikki pelaajat?")) return
    try {
      await clearPlayers()
    } catch (err) {
      console.error(err)
    }
  }

  async function handleJoin() {
    if (!user || !codename) return
    try {
      await joinSession({ uid: user.uid, codename, score: 0, guess: null })
    } catch (err) {
      console.error(err)
    }
  }


  if (authLoading) {
    return <p>Tarkistetaan kirjautumista...</p>
  }

  if (!user) {
    return <LoginForm />
  }

  const isInGame = session?.players.some((p) => p.uid === user.uid) ?? false

  return (
    <section id="center">
      <h1>Hintavisa</h1>
      <p>
        Tervetuloa, <strong>{codename}</strong>
      </p>
      <button type="button" onClick={logout}>
        Kirjaudu ulos
      </button>

      {!session ? (
        <p>Ladataan peliä...</p>
      ) : (
        <>
          <h2>{session.sessionName}</h2>
          <p>Tila: {session.status}</p>
          <p>
            Kierros: {session.currentRound} / {session.maxRounds}
          </p>

          <h3>Pelaajat</h3>
          <ul>
            {session.players.map((player) => (
              <li key={player.uid}>
                {player.codename} — pisteet: {player.score}
              </li>
            ))}
          </ul>

          {session.status === "waiting" && (
            <>
              <p>
                Odotetaan pelaajia. Peli alkaa, kun mukana on vähintään 2
                pelaajaa.
              </p>
              <p>Pelaajia nyt: {session.players.length} / 4</p>

              {!isInGame && (
                <button type="button" onClick={handleJoin}>
                  Liity peliin
                </button>
              )}

              <button
                type="button"
                onClick={handleStartGame}
                disabled={session.players.length < 2}
              >
                Aloita peli
              </button>

              <button type="button" onClick={handleClearPlayers}>
                Tyhjennä pelaajat
              </button>
            </>
          )}

          {session.status === "playing" && isInGame && (
            <QuizForm
              players={session.players}
              currentUserId={user.uid}
              currentProduct={session.currentProduct}
              correctPrice={session.correctPrice}
              onSubmitGuess={handleSubmitGuess}
              onNextRound={handleNextRound}
            />
          )}

          {session.status === "playing" && !isInGame && (
            <p>Peli on jo käynnissä. Odota seuraavaa peliä.</p>
          )}

          {session.status === "finished" && (
            <div>
              <h2>Peli päättyi</h2>
              <p>Voittaja: {session.winnerCodename}</p>
              <button type="button" onClick={handleResetGame}>
                Aloita alusta
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default App