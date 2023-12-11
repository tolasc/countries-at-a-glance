import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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
        <div className="main-page-content">
          <div className="filter-options">
            <form className="search-bar">
              <label>
                <ion-icon name="search-outline"></ion-icon>
                <input
                  onChange={(e) => setKeyWord(e.target.value)}
                  type="text"
                  placeholder="Search for a country..."
                  value={keyWord}
                />
              </label>
            </form>
            <RegionDropdown setRegion={setRegion} />
          </div>
          <div className="Country-list">
            <Countries
              region={region}
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

async function getCountryDataByRegion(regionName) {
  const res = await fetch(
    `https://restcountries.com/v3.1/region/${regionName}`,
  );
  return await res.json();
}

async function getCountryDataByName(name) {
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

function Countries({ region, keyWord, setFocusedCountry }) {
  console.log("running");
  const [countries, setCountries] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = region.match("All")
        ? await getAllCountriesData()
        : await getCountryDataByRegion(region);
      setCountries(result);
    };
    dataFetch();
  }, [region]);

  if (!countries) return <p>Loading...</p>;
  console.log("rendering");
  return (
    <CountryCards
      countries={countries.filter((country) =>
        country.name.common.match(
          new RegExp(JSON.stringify(keyWord).slice(1, -1), "i"),
        ),
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
      onClick={() => props.setFocusedCountry(props.name)}
    >
      <img src={props.flagImage} alt={`Flag of ${props.name}`} />
      <div className="Country-brief-container Country-brief-details">
        <h2>{props.name}</h2>
        <div className="Country-brief-container">
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
      </div>
    </div>
  );
}

function CountryPage({ country, setFocusedCountry }) {
  console.log(`Looking up:${country}`);
  const [countryInfo, setCountryInfo] = useState();
  const [borderCountries, setBorderCountries] = useState();
  useEffect(() => {
    const dataFetch = async () => {
      var result = await getCountryDataByName(country);
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
      <div className="Country-back">
        <button onClick={() => props.setFocusedCountry(null)}>
          <ion-icon name="chevron-back-outline"></ion-icon> Back
        </button>
      </div>
      <div className="Country-main-content">
        <img src={props.flagImage} alt={`Flag of ${props.name}`} />
        <div className="Country-content">
          <h2>{props.name}</h2>
          <div className="Country-main-details">
            <div className="Country-main-important-details">
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
            </div>
            <div className="Country-main-side-details">
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
            </div>
          </div>
          <div className="border-countries">
            <strong>Border Countries: </strong>
            <div className="border-button-list">
              {props.borderCountries === "None" ? (
                <p>None</p>
              ) : (
                props.borderCountries.map((countryName) => (
                  <button
                    className="border-button"
                    key={countryName}
                    onClick={() => props.setFocusedCountry(countryName)}
                  >
                    {countryName}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionDropdown({ setRegion }) {
  return (
    <Dropdown className="region-dropdown" onSelect={setRegion}>
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

export default App;
