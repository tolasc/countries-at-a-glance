import "./App.css";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [focusedCountry, setFocusedCountry] = useState();
  const [keyWord, setKeyWord] = useState("");
  const [region, setRegion] = useState("All");
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
        <div className="interactable">
          <form>
            <label>
              Search:
              <input onChange={(e) => setKeyWord(e.target.value)} type="text" />
            </label>
          </form>
          <RegionDropdown />
          <div className="Country-list">
            <Countries
              keyWord={keyWord}
              setFocusedCountry={setFocusedCountry}
            />
          </div>
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

async function getAllCountriesData() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  return await res.json();
}

async function getCountryData(name) {
  const res = await fetch(
    `https://restcountries.com/v3.1/name/${name}?fullText=true`,
  );
  return await res.json();
}

async function getMultiCodeData(codes) {
  const res = await fetch(
    `https://restcountries.com/v3.1/alpha?codes=${codes.join(",")}`,
  );
  return await res.json();
}

function expandCountry(name, setFocusedCountry) {
  setFocusedCountry(name);
  console.log(name);
}

function collapseCountry(setFocusedCountry) {
  console.log("bye");
  setFocusedCountry(null);
}

function Countries({ keyWord, setFocusedCountry }) {
  console.log("running");
  const [countries, setCountries] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = await getAllCountriesData();
      setCountries(result);
    };
    dataFetch();
  }, []);

  if (!countries) return "loading";
  console.log("rendering");
  return (
    <CountryCards
      countries={countries.filter((country) =>
        country.name.common.match(new RegExp(keyWord, "i")),
      )}
      setFocusedCountry={setFocusedCountry}
    />
  );
}

function CountryCards({ countries, setFocusedCountry }) {
  const list = countries.map((country) => (
    <CountryCard
      key={country.name.common}
      name={country.name.common}
      population={country.population.toLocaleString()}
      region={country.region}
      capital={country.capital}
      flagImage={country.flags.svg}
      setFocusedCountry={setFocusedCountry}
    />
  ));
  //console.log(list);
  return list;
}

function CountryCard(props) {
  return (
    <div
      className="Country-card"
      onClick={() => expandCountry(props.name, props.setFocusedCountry)}
    >
      <img src={props.flagImage} alt={`Flag of ${props.name}`} />
      <h2>{props.name}</h2>
      <p>
        <strong>Population: </strong>
        {props.population}
      </p>
      <p>
        <strong>Region: </strong>
        {props.region}
      </p>
      <p>
        <strong>Capital: </strong>
        {props.capital}
      </p>
    </div>
  );
}

function CountryPage({ country, setFocusedCountry }) {
  console.log(`Looking up:${country}`);
  const [countryInfo, setCountryInfo] = useState();
  const [borderCountries, setBorderCountries] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = await getCountryData(country);
      setCountryInfo(result[0]);
      if ("borders" in result[0])
        setBorderCountries(await getMultiCodeData(result[0].borders));
      else setBorderCountries("None");
    };
    dataFetch();
  }, [country]);

  if (!countryInfo || !borderCountries) return "loading";
  console.log(countryInfo);
  console.log(borderCountries);
  console.log("Trying render");
  return (
    <CountryDetails
      key={countryInfo.name.common}
      name={countryInfo.name.common}
      population={countryInfo.population.toLocaleString()}
      region={countryInfo.region}
      capital={countryInfo.capital}
      flagImage={countryInfo.flags.svg}
      nativeName={Object.values(countryInfo.name.nativeName)
        .map((language) => language.common)
        .join(", ")} //get first key into official
      subRegion={countryInfo.subregion}
      tld={countryInfo.tld.join(" ")} //space between entries
      currencies={Object.values(countryInfo.currencies)
        .map((currency) => currency.name)
        .join(", ")} //get all keys' name
      languages={Object.values(countryInfo.languages).join(", ")} //get all keys' value
      borderCountries={
        borderCountries === "None"
          ? borderCountries
          : borderCountries.map((borderCountry) => borderCountry.name.common)
      } //border into name lookups???
      setFocusedCountry={setFocusedCountry}
    />
  );
}

function CountryDetails(props) {
  return (
    <div className="Country-details">
      <button onClick={() => collapseCountry(props.setFocusedCountry)}>
        <ion-icon name="chevron-back-outline"></ion-icon> Back
      </button>
      <img src={props.flagImage} alt={`Flag of ${props.name}`} />
      <h2>{props.name}</h2>
      <p>
        <strong>Native Name: </strong>
        {props.nativeName}
      </p>
      <p>
        <strong>Population: </strong>
        {props.population}
      </p>
      <p>
        <strong>Region: </strong>
        {props.region}
      </p>
      <p>
        <strong>Sub Region: </strong>
        {props.subRegion}
      </p>
      <p>
        <strong>Capital: </strong>
        {props.capital}
      </p>
      <p></p>
      <p>
        <strong>Top Level Domain: </strong>
        {props.tld}
      </p>
      <p>
        <strong>Currencies: </strong>
        {props.currencies}
      </p>
      <p>
        <strong>Languages: </strong>
        {props.languages}
      </p>
      <div className="border-countries">
        <strong>Border Countries: </strong>
        <div className="border-button-list">
          {props.borderCountries === "None"
            ? "None"
            : props.borderCountries.map((countryName) => (
                <button
                  className="border-button"
                  key={countryName}
                  onClick={() =>
                    expandCountry(countryName, props.setFocusedCountry)
                  }
                >
                  {countryName}
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}

function RegionDropdown(props) {
  return (
    <Dropdown onSelect={go}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Filter by Region
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Item eventKey="Africa">Africa</Dropdown.Item>
        <Dropdown.Item eventKey="America">America</Dropdown.Item>
        <Dropdown.Item eventKey="Asia">Asia</Dropdown.Item>
        <Dropdown.Item eventKey="Europe">Europe</Dropdown.Item>
        <Dropdown.Item eventKey="Oceania">Oceania</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function go(e) {
  console.log(e);
}

export default App;
