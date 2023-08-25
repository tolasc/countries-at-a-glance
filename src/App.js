import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>Where in the world?</h1>
        </div>
      </header>
      <body>
        <CountryCard></CountryCard>
      </body>
    </div>
  );
}

function CountryCard() {
  return (
    <div className="Country-card">
      <img src="https://flagcdn.com/jp.svg" />
      <h2>Japan</h2>
      <p>
        <strong>Population: </strong>125,836,021
      </p>
      <p>
        <strong>Region: </strong>Asia
      </p>
      <p>
        <strong>Capital: </strong>Tokyo
      </p>
    </div>
  );
}

export default App;
