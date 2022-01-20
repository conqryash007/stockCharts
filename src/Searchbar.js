import React, { useState } from "react";

export default function Searchbar(props) {
  const [symbol, setSymbol] = useState("");
  const [search, setSearch] = useState("");
  const [choosen, setChoosen] = useState("");

  const push = () => {
    if (choosen) {
      props.graph(choosen);
    }
  };

  const getOptions = async () => {
    try {
      setSymbol("");
      let data = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${search}&apikey=${process.env.REACT_APP_API_KEY}`,
        {
          json: true,
          headers: { "User-Agent": "request" },
        }
      );
      data = await data.json();
      data = data["bestMatches"];
      setSymbol(data);
    } catch (err) {
      console.log(err);
    }
  };

  const optionUI = () => {
    if (symbol) {
      return symbol.map((curr, i) => {
        return (
          <option key={i} value={curr["1. symbol"]}>
            {curr["2. name"]}
          </option>
        );
      });
    }
  };

  return (
    <div className="container-001">
      <div>
        <label>Search Symbol : </label>
        <input type="text" onChange={(e) => setSearch(e.target.value)} />
        <button onClick={getOptions}>Search</button>
      </div>
      <div>
        <label>Choose a symbol : </label>
        <select onChange={(e) => setChoosen(e.target.value)}>
          {optionUI()}
        </select>
        <button onClick={push}>GET GRAPH</button>
      </div>
    </div>
  );
}
