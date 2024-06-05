import React from 'react';

import styled from 'styled-components';

import MovieComponent from './Movie';

const CenterDiv = styled.div`
  text-align: center;
`;

const Movies = styled.div`
  text-align: center;
  /* user-select: none; */
`;

export interface IMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface IMovieStatus {
  [x: string]: boolean;
  [key: number]: boolean;
}

function App() {
  const [movieStatuses, setMoviesStatus] = React.useState<IMovieStatus>({});
  const [movies, setMovies] = React.useState<IMovie[]>();

  React.useEffect(() => {
    const API_KEY = 'e3a89ca39100bceea4b71882246c87ff';
    const URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;
    fetch(URL, {
      // *GET, POST, PATCH, PUT, DELETE
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // For POST, PATCH, and PUT requests
      // body: JSON.stringify({ key: "value" }),
    })
      .then((response) => response.json())
      .then(({ results: movies }: { results: IMovie[] }) => {
        // Success
        const mutatedStatus: Record<string, boolean> = {};
        movies.map((row) => {
          mutatedStatus[row.id] = false;
        });
        setMoviesStatus(mutatedStatus);
        setMovies(movies);
      })
      .catch(() => {
        return false;
      })
      .finally(() => {
        return false;
      });
  }, []);

  const toggleAllOverviews = (isOverviewVisible: boolean) => {
    const mutatedMovies: IMovieStatus = {};
    const movieIDs = Object.keys(movieStatuses);
    for (let i = 0, arrayLength = movieIDs.length; i < arrayLength; i++) {
      const movieID = movieIDs[i];
      mutatedMovies[movieID] = isOverviewVisible;
    }
    setMoviesStatus(mutatedMovies);
  };

  const sort = (sortType: string) => {
    const voteAverage = 'vote_average'; // 1st priority
    const sortByPopularity = 'popularity'; // 2nd priority

    const sortedMovies = structuredClone(movies)?.sort((a, b) => {
      return (
        (sortType === 'asc' ? 1 : -1) * // Negate result for descending
        (a[voteAverage] - b[voteAverage] || // Main priority
          a[sortByPopularity] - b[sortByPopularity]) // Use another category if the former category values are equal
      );
    });

    setMovies(sortedMovies);
  };

  const toggleMovieOverview = (movieID: number) => {
    setMoviesStatus({
      ...movieStatuses,
      ...{ [movieID]: !movieStatuses[movieID] },
    });
  };

  return (
    <>
      {JSON.stringify(movieStatuses, null, 4)}
      <CenterDiv>
        <button
          onClick={() => {
            toggleAllOverviews(true);
          }}
          type="button"
        >
          Expand All
        </button>
        <button
          onClick={() => {
            toggleAllOverviews(false);
          }}
          type="button"
        >
          Collapse All
        </button>
        <button
          onClick={() => {
            sort('asc');
          }}
          type="button"
        >
          Ascending
        </button>
        <button
          onClick={() => {
            sort('desc');
          }}
          type="button"
        >
          Descending
        </button>
        <br />
        <br />
      </CenterDiv>

      <Movies>
        {movies?.map((row) => {
          return (
            <div
              key={row.id}
              onClick={() => {
                toggleMovieOverview(row.id);
              }}
              role="button"
              onKeyDown={() => {
                return false;
              }}
              tabIndex={0}
              aria-label="Close modal"
            >
              <MovieComponent
                key={row.id}
                movie={row}
                isOverviewVisible={movieStatuses[row.id]}
              />
            </div>
          );
        })}
      </Movies>
    </>
  );
}

export default App;
