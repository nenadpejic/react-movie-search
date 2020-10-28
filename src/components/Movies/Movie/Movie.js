import React from "react";
import "./style.css";
import imgSrc from "../../../images/placeholder.jpg";
import axios from "axios";

const Movie = ({ movie, dispatch }) => {
  const handleClick = (movieImdbID) => {
    const API = `http://www.omdbapi.com/?i=${movieImdbID}&plot=full&apiKey=3c0a7396`;
    axios
      .get(API)
      .then((res) => {
        // console.log(res.data);
        dispatch({
          type: "MOVIE_DETAILS",
          payload: { movieData: res.data },
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <li onClick={() => handleClick(movie.imdbID)}>
      {movie.Poster === "N/A" ? (
        <div className="pna">
          <img className="pna-img" src={imgSrc} alt="placeholder" />
          <span className="pna-content">Poster Not Available</span>
        </div>
      ) : (
        <img src={movie.Poster} alt="poster" />
      )}
      <p>
        {movie.Title} <span>({movie.Year})</span>
      </p>
    </li>
  );
};

export default Movie;
