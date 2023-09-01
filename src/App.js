import "./App.css";

let placeholderCountry = [
  {
    name: "Japan",
    population: "1",
    region: "Asia",
    capital: "Tokyo",
    flagImage: "https://flagcdn.com/jp.svg",
  },
  {
    name: "United States of America",
    population: "1",
    region: "Americas",
    capital: "Washington, D.C.",
    flagImage: "https://flagcdn.com/us.svg",
  },
];

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
          <CountryCard
            name="Japan"
            population="1"
            region="Asia"
            capital="Tokyo"
            flagImage="https://flagcdn.com/jp.svg"
          />
          <Countries countryList={placeholderCountry} />
        </div>
      </body>
    </div>
  );
}

async function getCountries() {
  const res = await fetch("https://restcountries.com/v3.1/all");
  console.log(res.json());
  return res;
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
