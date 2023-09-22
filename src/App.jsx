import { useEffect, useState } from "react";
import axios from 'axios';
import Movie from "./components/Movie";
import Youtube from 'react-youtube';
import Top from "./components/Top";

function App() {
    const MOVIE_API = "https://api.themoviedb.org/3/";
    const SEARCH_API = MOVIE_API + "search/movie";
    const DISCOVER_API = MOVIE_API + "discover/movie";
    const API_KEY = "b10ecd3b90ea987a4b565e49a991d961";
    const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280";

    const [playing, setPlaying] = useState(false);
    const [trailer, setTrailer] = useState(null);
    const [movies, setMovies] = useState([]);
    const [searchKey, setSearchKey] = useState("");
    const [movie, setMovie] = useState({ title: "Loading Movies" });
    // const [searchcolor,setSearchColor]=useState("text-white");

    useEffect(() => {
        fetchMovies();
        // if(localStorage.getItem("theme")? localStorage.getItem("theme"):"light"){
        //   setSearchColor("text-black")
        // }
        // else{
        //   setSearchColor("text-white")
        // }
    });

    const fetchMovies = async (event) => {
        if (event) {
            event.preventDefault();
        }

        const { data } = await axios.get(`${searchKey ? SEARCH_API : DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
                query: searchKey
            }
        });

        // console.log(data.results[0]);
        setMovies(data.results);
        setMovie(data.results[0]);

        if (data.results.length) {
            await fetchMovie(data.results[0].id);
        }
    };

    const fetchMovie = async (id) => {
        const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        });

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find(vid => vid.name === "Official Trailer");
            setTrailer(trailer ? trailer : data.videos.results[0]);
        }

        setMovie(data);
    };

    const selectMovie = (movie) => {
        fetchMovie(movie.id);
        setPlaying(false);
        setMovie(movie);
        window.scrollTo(0, 0);
    };

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    );

    return (
      <div className="items-center">
        <div className="max-w-[1680px] shadow-xl min-h-[400px] mx-auto p-3">
          <header className=" py-4">
            <div className="center-max-size">
              <Top/>
              <form className="mt-4" onSubmit={fetchMovies}>
                <div className="relative">
                  <input
                    className={`focus-outline border border-gray-500 bg-transparent py-2 px-4 rounded-full text-[#4338ca] bg-[#94a3b8] font-bold capitalize w-full placeholder:text-[#93c5fd]`}
                    type="search"
                    id="search"
                    placeholder="Search for movies..."
                    onInput={(event) => setSearchKey(event.target.value)}
                  />
                  <button className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent text-white cursor-pointer">
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </form>
            </div>
          </header>
          {movies.length ? (
            <main>
              {movie ? (
                <div
                  className="poster relative bg-cover bg-center min-h-[600px] flex items-end pb-10"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})`,
                  }}
                >
                  {playing ? (
                    <>
                      <Youtube
                        videoId={trailer.key}
                        className="youtube amru absolute inset-0"
                        containerClassName="youtube-container amru"
                        opts={{
                          width: "100%",
                          height: "100%",
                          playerVars: {
                            autoplay: 1,
                            controls: 0,
                            cc_load_policy: 0,
                            fs: 0,
                            iv_load_policy: 0,
                            modestbranding: 0,
                            rel: 0,
                            showinfo: 0,
                          },
                        }}
                      />
                      <button
                        onClick={() => setPlaying(false)}
                        className="button close-video absolute left-4 px-3 text-[#f8fafc] bg-[#2563eb]"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <div className="center-max-size">
                      <div className="poster-content">
                        {trailer ? (
                          <button
                            className="button play-video absolute bottom-4 text-[#f8fafc] px-3 bg-[#2563eb]"
                            onClick={() => setPlaying(true)}
                            type="button"
                          >
                            Play Trailer
                          </button>
                        ) : (
                          <div className="text-white text-3xl absolute top-10 left-10">
                            'Sorry, no trailer available'
                          </div>
                          
                        )}
                        <h1 className="text-5xl text-[#fafafa] font-bold mt-0 mb-4 uppercase">{movie.title},{movie.original_language}</h1>
                        <p className="text-white">{movie.overview}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
    
              <div className="center-max-size container py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {renderMovies()}
              </div>
            </main>
          ) : (
            <div className="center-max-size py-16 text-[#71717a] text-2xl">Sorry, no movies found</div>
          )}
        </div>
      </div>
        
      );
    }
    

export default App;