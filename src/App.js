import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Where in the world?</h1>
          <button>
            <ion-icon name="moon-outline"></ion-icon> Dark Mode
          </button>
        </div>
      </header>
      <body>
        <div className="Country-list">
          <Countries setFocusedCountry={setFocusedCountry} />
        </div>
      </body>
    </div>
  );
}

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  return await res.json();
}

function Countries({ setFocusedCountry }) {
  console.log("running");
  const [countries, setCountries] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = await getCountries();
      setCountries(result);
    };
    dataFetch();
  }, []);

  if (!countries) return "loading";
  console.log("rendering");
  return (
    <CountryCards countries={countries} setFocusedCountry={setFocusedCountry} />
  );
}

function CountryCards({ countries, setFocusedCountry }) {
  const list = countries.map((country) => (
    <CountryCard
      key={country.name.official}
      name={country.name.official}
      population={country.population}
      region={country.region}
      capital={country.capital}
      flagImage={country.flags.svg}
      setFocusedCountry={setFocusedCountry}
    />
  ));
  //console.log(list);
  return <div>{list}</div>;
}

function CountryCard({ name, population, region, capital, flagImage }) {
  return (
    <div className="Country-card">
      <img src={flagImage} alt={"Flag of " + { name }} />
      <h2>{name}</h2>
      <p>
        <strong>Population: </strong>
        {population}
      </p>
      <p>
        <strong>Region: </strong>
        {region}
      </p>
      <p>
        <strong>Capital: </strong>
        {capital}
      </p>
    </div>
  );
}

function Countries({ countryList }) {
  let arr = [];
  countryList.forEach((country) => {
    arr.push(
      <CountryCard
        name={country.name}
        population={country.population}
        region={country.region}
        capital={country.capital}
        flagImage={country.flagImage}
      />,
    );
  });
  return arr;
}

export default App;
