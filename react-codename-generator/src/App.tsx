
import { useState } from 'react'
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
  const [codename, setCodename] = useState(() => {
    const cachedName = localStorage.getItem('codename')

    if (cachedName) {
      return cachedName
    }

    const newName = generateCodename()

    localStorage.setItem('codename', newName)

    return newName
  })

  function handleNewCodename() {
    const newName = generateCodename()

    setCodename(newName)
    localStorage.setItem('codename', newName)
  }

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>

        <div>
          <h1>You have a fun codename in Local Storage!</h1>
        </div>

        <button
          type="button"
          className="counter"
          onClick={handleNewCodename}
        >
          Generate a new codename!
        </button>

        <p>Your codename: {codename}</p>
      </section>
    </>
  )
}

export default App
