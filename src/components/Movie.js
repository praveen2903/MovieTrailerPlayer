import React from 'react';

const Movie = ({ movie, selectMovie }) => {
    const IMAGE_PATH = "https://image.tmdb.org/t/p/w342";

    return (
        <div onClick={() => selectMovie(movie)} className="movie cursor-pointer">
            <div className="w-full shadow min-h-[200px] mt-3 pb-1 px-3 gap-10">
                {movie.poster_path && (
                    <img src={IMAGE_PATH + movie.poster_path} alt={movie.title} className="w-full object-cover" />
                )}
                <div className="flex justify-between items-center movie-info">
                    <h5 className="text-lg font-semibold text-[#1d4ed8]">{movie.title}</h5>
                    {movie.vote_average ? (
                        <span className="bg-gray-800 border border-gray-400 text-yellow-500 font-bold px-2 py-1 text-xs rounded-full">
                            {movie.vote_average}
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Movie;