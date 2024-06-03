import React from 'react';

interface IStock {
  open?: number;
  close?: number;
  high?: number;
  low?: number;
}

export default function StockData() {
  const searchInput = React.useRef<HTMLInputElement>(null);

  const [stockList, setStockList] = React.useState<IStock[]>([]);
  const [noResult, setNoResult] = React.useState(false);

  const handleSearch = () => {
    const date = searchInput.current?.value;

    if (date != null) {
      fetch('https://jsonmock.hackerrank.com/api/stocks?date=' + date)
        .then((response) => response.json())
        .then((result: { data: IStock[] }) => {
          if (result.data.length) {
            setStockList(result.data);
            setNoResult(false);
          } else {
            setNoResult(true);
            setStockList([]);
          }
        })
        .catch((error: unknown) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="layout-column align-items-center mt-50">
      <section className="layout-row align-items-center justify-content-center">
        <input
          ref={searchInput}
          type="text"
          className="large"
          placeholder="5-January-2000"
          id="app-input"
          data-testid="app-input"
        />
        <button
          onClick={() => {
            handleSearch();
          }}
          className=""
          id="submit-button"
          data-testid="submit-button"
        >
          Search
        </button>
      </section>

      {stockList.map((row: IStock, i) => (
        <ul
          key={i}
          className="mt-50 slide-up-fade-in styled"
          id="stockData"
          data-testid="stock-data"
        >
          <li className="py-10">Open: {row.open}</li>
          <li className="py-10">Close: {row.close}</li>
          <li className="py-10">High: {row.high}</li>
          <li className="py-10">Low: {row.low}</li>
        </ul>
      ))}

      {!noResult || (
        <div
          className="mt-50 slide-up-fade-in"
          id="no-result"
          data-testid="no-result"
        >
          No Results Found
        </div>
      )}
    </div>
  );
}
