
import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth, logout } from './authService'
import LoginForm from './LoginForm'

import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
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

  // Tarkistetaan Firebase-kirjautumisen tila
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        // Jokaisella käyttäjällä on oma Local Storage -avain
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
      }

      setAuthLoading(false)
    })

    // Lopetetaan kuuntelu, kun komponentti poistuu
    return () => unsubscribe()
  }, [])

  // Luodaan käyttäjälle uusi koodinimi
  function handleNewCodename() {
    if (!user) return

    const newName = generateCodename()
    const storageKey = `codename_${user.uid}`

    setCodename(newName)
    localStorage.setItem(storageKey, newName)
  }

  // Kirjaudutaan ulos
  async function handleLogout() {
    await logout()
  }

  // Odotetaan, että Firebase tarkistaa kirjautumistilan
  if (authLoading) {
    return <p>Tarkistetaan kirjautumista...</p>
  }

  // Jos käyttäjä ei ole kirjautunut, näytetään kirjautumislomake
  if (!user) {
    return <LoginForm />
  }

  // Kirjautuneen käyttäjän näkymä
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <h1>You have a fun codename in Local Storage!</h1>

        <p>Tervetuloa, {codename}</p>

        <button
          type="button"
          className="counter"
          onClick={handleNewCodename}
        >
          Generate a new codename!
        </button>

        <p>Your codename: {codename}</p>

        <button type="button" onClick={handleLogout}>
          Kirjaudu ulos
        </button>
      </section>
    </>
  )
}

export default App
