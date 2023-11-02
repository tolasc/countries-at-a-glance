import "./App.css";
import React, { useEffect, useState } from "react";

function App() {
  const [focusedCountry, setFocusedCountry] = useState();
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
      {focusedCountry == null ? (
        <div className="Country-list">
          <Countries setFocusedCountry={setFocusedCountry} />
        </div>
      ) : (
        <CountryPage
          country={focusedCountry}
          setFocusedCountry={setFocusedCountry}
        />
      )}
    </div>
  );
}

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  return await res.json();
}

async function getCountryData(name) {
  const res = await fetch(`https://restcountries.com/v3.1/name/Japan`);
  return await res.json();
}

function expandCountry(name, setFocusedCountry) {
  setFocusedCountry(name);
  console.log(name);
}

function collapseCountry(setFocusedCountry) {
  setFocusedCountry(null);
}

function CountryPage({ country, setFocusedCountry }) {
  console.log(`Looking up:${country}`);
  const [countryInfo, setCountryInfo] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = await getCountryData(country);
      setCountryInfo(result[0]);
    };
    dataFetch();
  }, [country]);

  if (!countryInfo) return "loading";
  console.log(countryInfo);
  console.log("Trying render");
  return (
    <CountryDetails
      key={countryInfo.name.official}
      name={countryInfo.name.official}
      population={countryInfo.population}
      region={countryInfo.region}
      capital={countryInfo.capital}
      flagImage={countryInfo.flags.svg}
      nativeName={countryInfo.name.nativeName.official} //get first key into official
      subRegion={countryInfo.subregion}
      tld={countryInfo.tld}
      currencies={countryInfo.currencies.USD.name} //get all keys' name
      languages={countryInfo.languages.eng} //get all keys' value
      borderCountries={countryInfo.borders} //border into name lookups???
      setFocusedCountry={setFocusedCountry}
    />
  );
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

function CountryCard({
  name,
  population,
  region,
  capital,
  flagImage,
  setFocusedCountry,
}) {
  return (
    <div
      className="Country-card"
      onClick={() => expandCountry(name, setFocusedCountry)}
    >
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

function CountryDetails({
  name,
  population,
  region,
  capital,
  flagImage,
  nativeName,
  subRegion,
  tld,
  currencies,
  languages,
  borderCountries,
}) {
  return (
    <div className="Country-details">
      <button>
        <ion-icon name="chevron-back-outline"></ion-icon> Back
      </button>
      <img src={flagImage} alt={"Flag of " + { name }} />
      <h2>{name}</h2>
      <p>
        <strong>Native Name: </strong>
        {nativeName}
      </p>
      <p>
        <strong>Population: </strong>
        {population}
      </p>
      <p>
        <strong>Region: </strong>
        {region}
      </p>
      <p>
        <strong>Sub Region: </strong>
        {subRegion}
      </p>
      <p>
        <strong>Capital: </strong>
        {capital}
      </p>
      <p></p>
      <p>
        <strong>Top Level Domain: </strong>
        {tld}
      </p>
      <p>
        <strong>Currencies: </strong>
        {currencies}
      </p>
      <p>
        <strong>Languages: </strong>
        {languages}
      </p>
      <p>
        <strong>Border Countries: </strong>
        {borderCountries}
      </p>
    </div>
  );
}

export default App;
