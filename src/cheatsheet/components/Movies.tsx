import React from 'react';

interface IMovie {
  Title: string;
  Year: number;
  imdbID: string;
}

function MovieList() {
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const [movieList, setMovieList] = React.useState<IMovie[]>([]);
  const [noResult, setNoResult] = React.useState(false);

  const handleSearch = () => {
    const year = searchInputRef.current?.value;

    if (year != null) {
      fetch('https://jsonmock.hackerrank.com/api/movies?Year=' + year)
        .then((response) => response.json())
        .then((result: { data: IMovie[] }) => {
          if (result.data.length !== 0) {
            setMovieList(result.data);
            setNoResult(false);
          } else {
            setNoResult(true);
            setMovieList([]);
          }
        })
        .catch((error: unknown) => {
          console.log(error);
        });
    }
  };
  const movies = (
    <ul className="mt-50 styled" data-testid="movieList">
      {movieList.map((row: IMovie, i) => (
        <li key={i}>{row.Title}</li>
      ))}
    </ul>
  );
  return (
    <div className="layout-column align-items-center mt-50">
      <section className="layout-row align-items-center justify-content-center">
        <input
          ref={searchInputRef}
          type="number"
          className="large"
          placeholder="Enter Year eg 2015"
          data-testid="app-input"
        />
        <button onClick={handleSearch} className="" data-testid="submit-button">
          Search
        </button>
      </section>

      {movies}

      {!noResult || (
        <div className="mt-50 slide-up-fade-in" data-testid="no-result">
          No Results Found
        </div>
      )}
    </div>
  );
}

export default MovieList;
