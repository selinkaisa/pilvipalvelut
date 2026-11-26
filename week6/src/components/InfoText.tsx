// src/components/InfoText.tsx
import { useState } from "react";

export default function InfoText() {
  const [open, setOpen] = useState(false);

  return (
    <section
      style={{
        maxWidth: "700px",
        margin: "2rem auto 6rem",
        padding: "0 1rem",
        textAlign: "left",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {open ? "Piilota teksti" : "Seurannan hyödyt ja CORS"}
      </button>

      {open && (
        <div>
          <h2>Seurannan hyödyt ja CORS</h2>
          <br />
          <p>
            Cloudflaren avulla sivustoon voidaan lisätä kävijöiden seuranta,
            jonka avulla kehittäjä saa tietoa sovelluksen käytöstä.
            Seurannasta voidaan selvittää esimerkiksi, kuinka moni käyttäjä
            avaa sovelluksen ja mistä kävijät tulevat. Hintavisassa voidaan
            seurata, kuinka moni aloittaa pelin ja kuinka moni pelaa sen
            loppuun. Lisäksi voidaan seurata, millä laitteilla ja selaimilla
            sovellusta käytetään. Näiden tietojen avulla kehittäjä pystyy
            arvioimaan sovelluksen toimivuutta ja tekemään tarvittavia
            parannuksia käyttökokemukseen. Jos moni esimerkiksi lopettaa pelin
            kesken, kysymyksiä tai pelin kestoa voisi muokata. Seurannan
            aloittaminen vasta käyttäjän hyväksynnän jälkeen on tärkeää
            yksityisyydensuojan vuoksi.
          </p>
          <br />
          <p>
            CORS (Cross-Origin Resource Sharing) on selaimen
            turvallisuusominaisuus, joka rajoittaa eri verkko-osoitteiden
            välistä tiedonsiirtoa. Jos sovellus yrittää hakea tietoa toisesta
            osoitteesta, kyseisen palvelimen täytyy sallia pyyntö. Muuten
            selain estää sen ja näyttää CORS-virheen. Ongelman voi välttää
            esimerkiksi sallimalla sovelluksen osoitteen palvelimen
            asetuksissa tai käyttämällä välityspalvelinta. Hintavisassa
            käytetään DummyJSON-palvelua tuotteiden hakemiseen. Haku toimii,
            koska DummyJSON sallii pyynnöt muilta verkkosivustoilta.
            Cloudflaren Beacon voidaan puolestaan ladata toiselta sivustolta
            script-tagilla, sillä selain sallii yleensä skriptien lataamisen
            eri verkko-osoitteista ilman CORS-virhettä.
          </p>
        </div>
      )}
    </section>
  );
}