import "./App.css";

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
        <CountryCard />
      </body>
    </div>
  );
}

function CountryCard() {
  return (
    <div className="Country-card">
      <img src="https://flagcdn.com/jp.svg" alt="Japan Flag" />
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
