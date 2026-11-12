import { useState } from "react";
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import {
  loginWithEmail,
  registerWithEmail,
} from "./authService";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleLogin = async (
  event: React.SubmitEvent<HTMLFormElement>
) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginWithEmail(email, password);
   } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Tuntematon virhe");
  }
}finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      await registerWithEmail(email, password);
    } catch {
      setError("Rekisteröityminen epäonnistui. Tarkista tiedot.");
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div>
      <h2>Kirjaudu sisään</h2>

<div className="hero">
  <img src={heroImg} className="base" width="170" height="179" alt="" />
  <img src={reactLogo} className="framework" alt="React logo" />
  <img src={viteLogo} className="vite" alt="Vite logo" />
</div>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Sähköposti</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Salasana</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Kirjaudutaan..." : "Kirjaudu"}
        </button>

        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Odota..." : "Luo käyttäjätili"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;