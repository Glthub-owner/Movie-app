import React from "react";
import Movie from "./components/Movie";
import "./styles/style.css";
import InfiniteScroll from "react-infinite-scroll-component";

const searchAPI =
  "https://api.themoviedb.org/3/search/movie?api_key=3fd2be6f0c70a2a598f084ddfb75487c&query=";

export default function App() {
  const [movies, setMovies] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [page, setPage] = React.useState(2);
  const [hasMore, setHasMore] = React.useState(true);

  React.useEffect(() => {
    const getMovies = async () => {
      const res = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US&page=1"
      );
      const data = await res.json();
      setMovies(data.results);
    };
    getMovies();
  }, []);

  const getNextMovies = async () => {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=3fd2be6f0c70a2a598f084ddfb75487c&language=en-US&page=${page}`
    );
    const data = await res.json();
    return data.results;
  };

  const fetchData = async () => {
    const newMovies = await getNextMovies();

    setMovies([...movies, ...newMovies]);

    if (newMovies.length === 0 || newMovies.length < 20) {
      setHasMore(false);
    }
    setPage(page + 1);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (searchTerm) {
      fetch(searchAPI + searchTerm)
        .then((res) => res.json())
        .then((data) => {
          setMovies(data.results);
        });

      setSearchTerm("");
    } else {
      console.log("wrong");
    }
  };
  const handleOnChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-container container">
      <header>
        <form onSubmit={handleOnSubmit}>
          <input
            className="search"
            type="search"
            placeholder="Search.."
            value={searchTerm}
            onChange={handleOnChange}
          />
        </form>
      </header>
      <InfiniteScroll
        dataLength={movies.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="movie-container ">
          {movies.length > 0 &&
            movies.map((movie) => <Movie key={movie.id} {...movie} />)}
        </div>
      </InfiniteScroll>
      ;
    </div>
  );
}
